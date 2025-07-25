import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ct00Entity } from "src/general-accounting/entity/ct00.entity";
import { formatDateToYYYYMMDD } from "src/type/date";
import { Between, DataSource, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { CreateFullPh71Dto } from "./dto/create-full.dto";
import { Ct71Entity } from "./entity/ct71.entity";
import { Ct71GtEntity } from "./entity/ct71gt.entity";
import { Ph71Entity } from "./entity/ph71.entity";

export class phieuMuaService {
    constructor(
        @InjectRepository(Ct71Entity)
        private readonly ct71Repository: Repository<Ct71Entity>,
        @InjectRepository(Ph71Entity)
        private readonly ph71Repository: Repository<Ph71Entity>,
        @InjectRepository(Ct71GtEntity)
        private readonly ct71GtRepository: Repository<Ct71GtEntity>,
        @InjectRepository(Ct00Entity)
        private readonly ct00Repository: Repository<Ct00Entity>,
        private readonly dataSource: DataSource
    ) { }
    async createFullPhieu(dto: CreateFullPh71Dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const { phieu, hangHoa, hdThue } = dto;
        const stt_rec = `APNA${Date.now()}`.substring(0, 11);
        const ma_dvcs = 'CTY';
        const ma_ct = 'PNA';
        const ty_gia = '1';
        const ngay_ct0_raw = new Date(hdThue[0]?.ngay_ct0 ?? '');
        const ngay_ct0 = formatDateToYYYYMMDD(ngay_ct0_raw);
        try {

            // 1. CheckExistsHDvao nếu có dữ liệu
            if (hdThue?.length > 0) {
                await queryRunner.manager.query(`EXEC CheckExistsHDvao @0, @1, @2, @3, @4`, [
                    stt_rec,
                    hdThue[0]?.so_ct0,
                    hdThue[0]?.so_seri0,
                    ngay_ct0,
                    hdThue[0]?.ma_so_thue,
                ]);
            }

            // 2. Insert PH71
            await queryRunner.manager.save(Ph71Entity, {
                ...phieu,
                stt_rec,
                ma_dvcs,
                ma_ct,
                ngay_ct: new Date(phieu.ngay_ct),
                ngay_lct: new Date(phieu.ngay_lct),
                ty_gia,
            });

            await queryRunner.manager.save(Ct00Entity, {
                stt_rec,
                ma_ct,
                ma_dvcs,
                ngay_ct: new Date(phieu.ngay_ct),
                so_ct: phieu.so_ct,
                dien_giai: phieu.dien_giai,
                ong_ba: phieu.ong_ba,
                ma_kh: phieu.ma_kh,
                ma_qs: phieu.ma_qs,
                ty_gia
            });

            // 3. Delete + Insert CT71
            await queryRunner.manager.delete(Ct71Entity, { stt_rec });
            const ct71WithMeta = hangHoa.map(item => ({
                ...item,
                stt_rec,
                ma_dvcs,
                ma_ct,
                ty_gia,
            }));
            await queryRunner.manager.save(Ct71Entity, ct71WithMeta);

            // 4. Delete + Insert CT71GT
            await queryRunner.manager.delete(Ct71GtEntity, { stt_rec });
            const ct71gtWithMeta = hdThue.map(item => ({
                ...item,
                stt_rec,
                ma_ct,
                ma_dvcs,
                ty_gia
            }));
            await queryRunner.manager.save(Ct71GtEntity, ct71gtWithMeta);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(error.message);
        } finally {
            await queryRunner.release();
        }

        // 👉 Giai đoạn 2: gọi các thủ tục yêu cầu Snapshot Isolation (ngoài transaction)
        try {
            await this.dataSource.query(`EXEC [dbo].[POCTPNA-CheckData] @0, @1`, ['2', stt_rec]);
            await this.dataSource.query(`EXEC [POCTPNA-Post] @0`, [stt_rec]);
        } catch (error) {
            throw new InternalServerErrorException(`Lỗi khi gọi CheckData/Post: ${error.message}`);
        }
    }


    async getPh71ById(stt_rec: string) {
        const ph71 = await this.ph71Repository.findOne({
            where: { stt_rec },
            relations: ['ct71', 'ct71gt'],
        });
        return ph71;
    }

    async updateFullPhieu(stt_rec: string, dto: CreateFullPh71Dto) {
        const { phieu, hangHoa, hdThue } = dto;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const ma_dvcs = 'CTY';
            const ma_ct = 'PNA';
            const ty_gia = '1';
            const ngay_ct0_raw = new Date(hdThue[0]?.ngay_ct0 ?? '');
            const ngay_ct0 = formatDateToYYYYMMDD(ngay_ct0_raw);

            // 1. Kiểm tra tồn tại
            const existing = await queryRunner.manager.findOne(Ph71Entity, {
                where: { stt_rec, ma_ct },
            });
            if (!existing) {
                throw new NotFoundException('Phiếu không tồn tại');
            }

            // 2. CheckExistsHDvao nếu có
            if (hdThue?.length > 0) {
                await queryRunner.manager.query(`EXEC CheckExistsHDvao @0, @1, @2, @3, @4`, [
                    stt_rec,
                    hdThue[0]?.so_ct0,
                    hdThue[0]?.so_seri0,
                    ngay_ct0,
                    hdThue[0]?.ma_so_thue,
                ]);
            }

            // 3. Update PH71
            await queryRunner.manager.update(
                Ph71Entity,
                { stt_rec, ma_ct, ma_dvcs, ty_gia },
                phieu,
            );
            // 4. Delete + Insert CT71
            await queryRunner.manager.delete(Ct71Entity, { stt_rec });
            if (hangHoa?.length) {
                const ct71WithMeta = hangHoa.map(item => ({
                    ...item,
                    stt_rec,
                    ma_ct,
                    ma_dvcs,
                    ty_gia
                }));
                await queryRunner.manager.save(Ct71Entity, ct71WithMeta);
            }

            // 5. Delete + Insert CT71GT
            await queryRunner.manager.delete(Ct71GtEntity, { stt_rec });
            if (hdThue?.length) {
                const ct71gtWithMeta = hdThue.map(item => ({
                    ...item,
                    stt_rec,
                    ma_ct,
                    ma_dvcs,
                    ty_gia
                }));
                await queryRunner.manager.save(Ct71GtEntity, ct71gtWithMeta);
            }

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(error.message || 'Lỗi cập nhật phiếu');
        } finally {
            await queryRunner.release();
        }

        // 6. CheckData và Post sau khi transaction thành công
        try {
            await this.dataSource.query(`EXEC [dbo].[POCTPNA-CheckData] @0, @1`, ['2', stt_rec]);
            await this.dataSource.query(`EXEC [POCTPNA-Post] @0`, [stt_rec]);
            return { message: 'Cập nhật phiếu thành công' };
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Lỗi Check/Post phiếu');
        }
    }


    async deletePh71(stt_rec: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const ma_ct = 'PNA';
            await this.dataSource.query(
                `EXEC [dbo].[CheckEditVoucher] @0`,
                [stt_rec]
            );

            await this.dataSource.query(
                `EXEC [dbo].[DeleteVoucher] @0, @1`,
                [ma_ct, stt_rec]
            );
            await queryRunner.commitTransaction();
            return { message: 'Xóa phiếu thành công' };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(error.message || 'Lỗi xóa phiếu');
        } finally {
            await queryRunner.release();
        }
    }

    async getAllPh71(
        page: number,
        limit: number,
        search: string,
        so_ct?: string,
        tu_ngay?: string,
        den_ngay?: string,
    ) {
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where['$or'] = [
                { dien_giai: ILike(`%${search}%`) },
                { ma_kho: ILike(`%${search}%`) },
                { ong_ba: ILike(`%${search}%`) },
            ];
        }

        if (so_ct) {
            where.so_ct = so_ct;
        }

        if (tu_ngay && den_ngay) {
            where.ngay_lct = Between(new Date(tu_ngay), new Date(den_ngay));
        } else if (tu_ngay) {
            where.ngay_lct = MoreThanOrEqual(new Date(tu_ngay));
        } else if (den_ngay) {
            where.ngay_lct = LessThanOrEqual(new Date(den_ngay));
        }

        const [data, total] = await this.ph71Repository.findAndCount({
            where,
            relations: ['ct71', 'ct71gt'],
            skip,
            take: limit,
            order: { ngay_ct: 'DESC' },
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}



