import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ct00Entity } from "src/general-accounting/entity/ct00.entity";
import { formatDateToYYYYMMDD } from "src/type/date";
import { DataSource, ILike, Repository } from "typeorm";
import { CreateFullPh73Dto } from "./dto/create-full.dto";
import { Ct73Entity } from "./entity/ct73.entity";
import { Ct73GtEntity } from "./entity/ct73gt.entity";
import { Ph73Entity } from "./entity/ph73.entity";

export class ChiPhiMuaHangService {
    constructor(
        @InjectRepository(Ct73Entity)
        private readonly ct73Repository: Repository<Ct73Entity>,
        @InjectRepository(Ph73Entity)
        private readonly ph73Repository: Repository<Ph73Entity>,
        @InjectRepository(Ct73GtEntity)
        private readonly ct73GtRepository: Repository<Ct73GtEntity>,
        @InjectRepository(Ct00Entity)
        private readonly ct00Repository: Repository<Ct00Entity>,
        private readonly dataSource: DataSource
    ) { }

    async createFullPhieu(dto: CreateFullPh73Dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        const { phieu, chiPhi, hdThue } = dto;
        const stt_rec = `APNC${Date.now()}`.substring(0, 11);
        const ma_dvcs = 'CTY';
        const ma_ct = 'PNC';
        const ty_gia = '1';
        const ngay_ct0_raw = new Date(hdThue[0]?.ngay_ct0 ?? '');
        const ngay_ct0 = formatDateToYYYYMMDD(ngay_ct0_raw);
        try {
            if (hdThue?.length > 0) {
                await queryRunner.manager.query(`EXEC CheckExistsHDvao @0, @1, @2, @3, @4`, [
                    stt_rec,
                    hdThue[0]?.so_ct0,
                    hdThue[0]?.so_seri0,
                    ngay_ct0,
                    hdThue[0]?.ma_so_thue,
                ]);
            }
            await queryRunner.startTransaction();
            await queryRunner.manager.save(Ph73Entity, {
                ...phieu,
                stt_rec,
                ma_dvcs,
                ma_ct,
                ngay_ct: new Date(phieu.ngay_ct),
                ngay_lct: new Date(phieu.ngay_lct),
                ty_gia
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

            await queryRunner.manager.delete(Ct73Entity, { stt_rec });
            const ct73WithMeta = chiPhi.map(item => ({
                ...item,
                stt_rec,
                ma_dvcs,
                ma_ct,
                ty_gia
            }));
            await queryRunner.manager.save(Ct73Entity, ct73WithMeta);

            await queryRunner.manager.delete(Ct73GtEntity, { stt_rec });
            const ct73gtWithMeta = hdThue.map(item => ({
                ...item,
                stt_rec,
                ma_ct,
                ma_dvcs,
                ty_gia,
                ngay_ct0
            }));
            await queryRunner.manager.save(Ct73GtEntity, ct73gtWithMeta);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(error.message);
        } finally {
            await queryRunner.release();
        }

        try {
            await this.dataSource.query(`EXEC [dbo].[POCTPNC-CheckData] @0, @1`, ['2', stt_rec]);
            await this.dataSource.query(`EXEC [POCTPNC-Post] @0`, [stt_rec]);
        } catch (error) {
            throw new InternalServerErrorException(`Lỗi khi gọi CheckData/Post: ${error.message}`);
        }
    }

    async getPh73ById(stt_rec: string) {
        const ph73 = await this.ph73Repository.findOne({
            where: { stt_rec },
            relations: ['ct73', 'ct73gt'],
        });
        return ph73;
    }

    async updateFullPhieu(stt_rec: string, dto: CreateFullPh73Dto) {
        const { phieu, chiPhi, hdThue } = dto;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const ma_dvcs = 'CTY';
            const ma_ct = 'PNC';
            const ty_gia = '1';

            const existing = await queryRunner.manager.findOne(Ph73Entity, {
                where: { stt_rec, ma_ct },
            });
            if (!existing) {
                throw new NotFoundException('Phiếu không tồn tại');
            }

            if (hdThue?.length > 0) {
                const { so_ct0, so_seri0, ngay_ct0, ma_so_thue } = hdThue[0];
                await queryRunner.manager.query(
                    `EXEC CheckExistsHDvao @0, @1, @2, @3, @4`,
                    [stt_rec, so_ct0, so_seri0, ngay_ct0, ma_so_thue],
                );
            }
            await queryRunner.startTransaction();
            await queryRunner.manager.update(
                Ph73Entity,
                { stt_rec, ma_ct, ma_dvcs, ty_gia },
                phieu,
            );

            await queryRunner.manager.delete(Ct73Entity, { stt_rec });
            if (chiPhi?.length) {
                const ct73WithMeta = chiPhi.map(item => ({
                    ...item,
                    stt_rec,
                    ma_ct,
                    ma_dvcs,
                    ty_gia
                }));
                await queryRunner.manager.save(Ct73Entity, ct73WithMeta);
            }

            await queryRunner.manager.delete(Ct73GtEntity, { stt_rec });
            if (hdThue?.length) {
                const ct73gtWithMeta = hdThue.map(item => ({
                    ...item,
                    stt_rec,
                    ma_ct,
                    ma_dvcs,
                    ty_gia
                }));
                await queryRunner.manager.save(Ct73GtEntity, ct73gtWithMeta);
            }

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(error.message || 'Lỗi cập nhật phiếu');
        } finally {
            await queryRunner.release();
        }

        try {
            await this.dataSource.query(`EXEC [dbo].[POCTPNC-CheckData] @0, @1`, ['2', stt_rec]);
            await this.dataSource.query(`EXEC [POCTPNC-Post] @0`, [stt_rec]);
            return { message: 'Cập nhật phiếu thành công' };
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Lỗi Check/Post phiếu');
        }
    }

    async deletePh73(stt_rec: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const ma_ct = 'PNC';
            const date = new Date();
            const time = new Date().toTimeString().substring(0, 8);
            await this.dataSource.query(`EXEC [dbo].[CheckEditVoucher] @0`, [stt_rec]);
            await this.dataSource.query(`EXEC [dbo].[UpdateInfoVoucherDelete] @0, @1, @2, @3, @4`, [stt_rec, ma_ct, date, time, '1']);
            await this.dataSource.query(`EXEC [dbo].[DeleteVoucher] @0, @1`, [ma_ct, stt_rec]);
            await queryRunner.commitTransaction();
            return { message: 'Xóa phiếu thành công' };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(error.message || 'Lỗi xóa phiếu');
        } finally {
            await queryRunner.release();
        }
    }

    async getAllPh73(page: number, limit: number, search: string) {
        const skip = (page - 1) * limit;

        const whereCondition = search
            ? [
                { dien_giai: ILike(`%${search}%`) },
                { ma_kho: ILike(`%${search}%`) },
                { ong_ba: ILike(`%${search}%`) },
            ]
            : {};

        const [data, total] = await this.ph73Repository.findAndCount({
            where: whereCondition,
            relations: ['ct73', 'ct73gt'],
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
