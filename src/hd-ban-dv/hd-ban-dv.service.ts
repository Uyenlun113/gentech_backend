import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateFullPh21Dto } from "./dto/create-full.dto";
import { Ct21Entity } from "./entity/ct21.entity";
import { Ph21Entity } from "./entity/ph21.entity";


export class HdBanDvService {
    constructor(
        @InjectRepository(Ph21Entity)
        private readonly ph21Repository: Repository<Ph21Entity>,

        @InjectRepository(Ct21Entity)
        private readonly ct21Repository: Repository<Ct21Entity>,

        private readonly dataSource: DataSource
    ) { }

    async createOrUpdateFullPhieu(dto: CreateFullPh21Dto) {
        const { phieu, hangHoa } = dto;
        const ma_ct = 'HD1';
        const ma_dvcs = 'CTY';
        const ty_gia = 1;
        const stt_rec = `AHD1${Date.now()}`.substring(0, 11);

        await this.dataSource.query(
            `EXEC [dbo].[CheckValidSoCt#3] @ma_qs = @0, @so_ct = @1`,
            [phieu.ma_qs, phieu.so_ct]
        );
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.save(this.ph21Repository.create({
                ...phieu,
                ma_ct,
                ty_gia,
                ma_dvcs,
                stt_rec,
            }));


            const chiTietEntities = hangHoa.map((item) =>
                this.ct21Repository.create({ ...item, stt_rec, ma_ct, so_ct: phieu.so_ct }),
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
            `EXEC [dbo].[ARCTHD1-CheckData] @status = @0,@mode = @1, @stt_rec = @2`,
            ['2', 1, stt_rec]
        );

        await this.dataSource.query(
            `EXEC [dbo].[ARCTHD1-Post] @stt_rec = @0, @IsHasPT1 = @1`,
            [stt_rec, 0]
        );

        return { success: true, message: 'Tạo phiếu thành công' };
    }


    async listHdBanDv(page = 1, limit = 10) {
        const [data, total] = await this.ph21Repository.findAndCount({
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

    async updateHdBanDv(stt_rec: string, dto: CreateFullPh21Dto) {
        const { phieu, hangHoa } = dto;
        const ma_ct = 'HD1';
        const ma_dvcs = 'CTY';
        const ty_gia = 1;
        await this.dataSource.query(
            `EXEC dbo.CheckValidSoCt#3 @ma_qs = @0, @so_ct = @1`,
            [phieu.ma_qs, phieu.so_ct],
        );

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const existingPhieu = await this.ph21Repository.findOne({
                where: { stt_rec, ma_ct, ma_kh: phieu.ma_kh },
            });

            if (existingPhieu) {
                await this.ph21Repository.update(
                    { stt_rec, ma_ct, ma_kh: phieu.ma_kh, ty_gia },
                    phieu,
                );
            } else {
                await this.ph21Repository.save({
                    ma_ct,
                    ma_dvcs,
                    stt_rec, ty_gia,
                    ...phieu,
                });
            }
            await this.ct21Repository.delete({ stt_rec });
            const chiTietEntities = hangHoa.map((item) =>
                this.ct21Repository.create({ ...item, stt_rec, ma_ct, so_ct: phieu.so_ct }),
            );
            await this.ct21Repository.save(chiTietEntities);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
        await this.dataSource.query(
            `EXEC [dbo].[ARCTHD1-CheckData] @status = @0,@mode = @1, @stt_rec = @2`,
            ['2', 0, stt_rec]
        );

        await this.dataSource.query(
            `EXEC [dbo].[ARCTHD1-Post] @stt_rec = @0,@IsHasPT1 = @1`,
            [stt_rec, 0]
        );

        return { success: true, message: 'Cập nhật phiếu thành công' };
    }

    async deleteHdBanDv(stt_rec: string) {
        const checkResult = await this.dataSource.query(
            `EXEC [dbo].[CheckEditVoucher] @stt_rec = @0`,
            [stt_rec],
        );
        if (checkResult[0]?.can_delete === 0) {
            throw new BadRequestException('Phiếu đã ghi sổ, không được xóa');
        }

        const ma_ct = 'HD1';
        const date = new Date();
        const time = new Date().toTimeString().substring(0, 8);

        const [dmhd] = await this.ph21Repository.find({ where: { stt_rec, ma_ct } });
        if (!dmhd) throw new NotFoundException('Không tìm thấy phiếu');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
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

    async getHdBanDvBySttRec(stt_rec: string) {
        return await this.ph21Repository.findOne({
            where: { stt_rec },
            relations: ['hangHoa', 'hangHoa.tkDtInfo'],
        });

    }


}