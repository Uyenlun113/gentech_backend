import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateFullPhieuDto } from "./dto/create-full-phieu.dto";
import { DmhdEntity } from "./entity/dmhd.entity";
import { DmhdctEntity } from "./entity/dmhdct.entity";

export class DonBanHangService {
    constructor(
        @InjectRepository(DmhdctEntity)
        private readonly dmhdctRepository: Repository<DmhdctEntity>,

        @InjectRepository(DmhdEntity)
        private readonly dmhdRepository: Repository<DmhdEntity>,

        private readonly dataSource: DataSource
    ) { }

    async createOrUpdateFullPhieu(dto: CreateFullPhieuDto) {
        const { phieu, hangHoa } = dto;
        const ma_ct = 'HDB';
        const ma_dvcs = 'CTY';
        const stt_rec = `AHDB${Date.now()}`.substring(0, 11);

        // ✅ Gọi stored procedure CheckValidSoCt#3 TRƯỚC transaction (vì yêu cầu snapshot)
        await this.dataSource.query(
            `EXEC [dbo].[CheckValidSoCt#3] @ma_qs = @0, @so_ct = @1`,
            [phieu.ma_qs, phieu.so_ct]
        );
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(this.dmhdRepository.create({
                ...phieu,
                ma_ct,
                ma_dvcs,
                stt_rec,
            }));


            const chiTietEntities = hangHoa.map((item) =>
                this.dmhdctRepository.create({ ...item, stt_rec, ma_ct, so_ct: phieu.so_ct }),
            );
            await queryRunner.manager.save(chiTietEntities);

            await queryRunner.commitTransaction();
        } catch (err) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw err;
        } finally {
            await queryRunner.release();
        }
        await this.dataSource.query(
            `EXEC [dbo].[SODMHDB-CheckData] @status = @0, @stt_rec = @1`,
            ['2', stt_rec]
        );

        await this.dataSource.query(
            `EXEC [dbo].[SODMHDB-Post] @stt_rec = @0`,
            [stt_rec]
        );

        return { success: true, message: 'Tạo phiếu thành công' };
    }


    async listDonBanHang(page = 1, limit = 10) {
        const [data, total] = await this.dmhdRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { ngay_ct: 'DESC' },
            relations: ['hangHoa'],
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateDonBanHang(stt_rec: string, dto: CreateFullPhieuDto) {
        const { phieu, hangHoa } = dto;
        const ma_ct = 'HDB';
        const ma_dvcs = 'CTY';
        await this.dataSource.query(
            `EXEC dbo.CheckValidSoCt#3 @ma_qs = @0, @so_ct = @1`,
            [phieu.ma_qs, phieu.so_ct],
        );

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const existingPhieu = await this.dmhdRepository.findOne({
                where: { stt_rec, ma_ct, ma_kh: phieu.ma_kh },
            });

            if (existingPhieu) {
                await this.dmhdRepository.update(
                    { stt_rec, ma_ct, ma_kh: phieu.ma_kh },
                    phieu,
                );
            } else {
                await this.dmhdRepository.save({
                    ma_ct,
                    ma_dvcs,
                    stt_rec,
                    ...phieu,
                });
            }
            await this.dmhdctRepository.delete({ stt_rec });
            const chiTietEntities = hangHoa.map((item) =>
                this.dmhdctRepository.create({ ...item, stt_rec, ma_ct, so_ct: phieu.so_ct }),
            );
            await this.dmhdctRepository.save(chiTietEntities);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
        await this.dataSource.query(
            `EXEC [dbo].[SODMHDB-CheckData] @status = @0, @stt_rec = @1`,
            ['2', stt_rec]
        );

        await this.dataSource.query(
            `EXEC [dbo].[SODMHDB-Post] @stt_rec = @0`,
            [stt_rec]
        );


        return { success: true, message: 'Cập nhật phiếu thành công' };
    }

    async deletePhieu(stt_rec: string) {
        const checkResult = await this.dataSource.query(
            `EXEC [dbo].[CheckEditVoucher] @stt_rec = @0`,
            [stt_rec],
        );
        if (checkResult[0]?.can_delete === 0) {
            throw new BadRequestException('Phiếu đã ghi sổ, không được xóa');
        }

        const ma_ct = 'HDB';
        const date = new Date();
        const time = new Date().toTimeString().substring(0, 8);

        const [dmhd] = await this.dmhdRepository.find({ where: { stt_rec, ma_ct } });
        if (!dmhd) throw new NotFoundException('Không tìm thấy phiếu');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // ⚠️ Kiểm tra phiếu đã khóa sổ chưa
            const countLocked = await queryRunner.manager.query(
                `SELECT COUNT(1) as count FROM dmct WHERE ma_ct = @0 AND ngay_ks >= @1`,
                [ma_ct, dmhd.ngay_ct],
            );
            if (countLocked[0]?.count > 0) {
                throw new BadRequestException('Phiếu đã khóa sổ, không được xóa');
            }

            await this.dataSource.query(`EXEC [dbo].[UpdateInfoVoucherDelete] @0, @1, @2, @3, @4`, [stt_rec, ma_ct, date, time, '1']);
            await this.dataSource.query(`EXEC [dbo].[DeleteVoucher] @0, @1`, [ma_ct, stt_rec]);

            await queryRunner.commitTransaction();
            return { success: true, message: 'Xóa phiếu thành công' };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getDonBanHangBySttRec(stt_rec: string) {
        return await this.dmhdRepository.findOne({ where: { stt_rec }, relations: ['hangHoa'], });
    }


}