import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePh85DtoWithVatTu } from './dto/CreatePh85Dto';
import { Ct85Entity } from './entity/ct85.entity';
import { Ph85Entity } from './entity/ph85.entity';

@Injectable()
export class Ph85Service {
    constructor(
        @InjectRepository(Ph85Entity)
        private readonly ph85Repo: Repository<Ph85Entity>,

        @InjectRepository(Ct85Entity)
        private readonly ct85Repo: Repository<Ct85Entity>,

        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }


    async createPhieuXuat(dto: CreatePh85DtoWithVatTu) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const { vatTu, phieu } = dto;
            const ma_ct = 'PXE';
            const stt_rec = `APXE${Date.now()}`.substring(0, 11);
            const ma_dvcs = 'CTY';
            const ngay_ct = new Date();
            await queryRunner.startTransaction();
            const ph85 = queryRunner.manager.create(Ph85Entity, { ...phieu, ma_ct, stt_rec, ma_dvcs });
            await queryRunner.manager.save(Ph85Entity, ph85);
            if (vatTu.length === 0) {
                throw new BadRequestException('Chi tiết chứng từ không được để trống');
            }
            for (const item of vatTu) {
                const ct85 = queryRunner.manager.create(Ct85Entity, { ...item, stt_rec, ma_ct, ma_dvcs, ngay_ct });
                await queryRunner.manager.save(Ct85Entity, ct85);
            }
            await queryRunner.commitTransaction();
            try {
                await queryRunner.query(
                    `EXEC [dbo].[INCTPXE-CheckData] @status = @0, @mode = @1, @stt_rec = @2`,
                    [phieu.status, '1', stt_rec],
                );
                await queryRunner.query(
                    `EXEC GetTon13 @ma_kho = @0, @ma_vt = @1`,
                    [phieu.ma_kho, vatTu[0].ma_vt]
                );
                await queryRunner.startTransaction();
                await queryRunner.manager.update(
                    Ph85Entity,
                    { stt_rec },
                    {
                        t_so_luong: phieu.t_so_luong,
                        ty_gia: phieu.ty_gia,
                    },
                );
                await queryRunner.commitTransaction();
                await queryRunner.query(
                    `EXEC [dbo].[INCTPXE-Post] @stt_rec = @0`,
                    [stt_rec],
                );

            } catch (spError) {
                await queryRunner.startTransaction();
                await queryRunner.manager.delete(Ct85Entity, { stt_rec });
                await queryRunner.manager.delete(Ph85Entity, { stt_rec });
                await queryRunner.commitTransaction();
                throw spError;
            }

            return {
                success: true,
                message: 'Tạo phiếu xuất điều chuyển thành công',
                data: ph85
            };
        } catch (err) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            console.error('Transaction Error:', err);
            throw new InternalServerErrorException('Tạo phiếu xuất điều chuyển thất bại');
        } finally {
            await queryRunner.release();
        }
    }


    async findAll({ page, limit, search }: { page: number; limit: number; search?: string }) {
        try {
            const skip = (page - 1) * limit;
            const [items, total] = await this.ph85Repo.findAndCount({
                where: search ? { ma_ct: search } : {},
                skip,
                take: limit,
                order: { ngay_ct: 'DESC' },
            });
            return {
                total,
                page,
                limit,
                data: items,
            };
        } catch (error) {
            throw new InternalServerErrorException('Lấy danh sách phiếu xuất điều chuyển thất bại');
        }
    }
    async findById(stt_rec: string) {
        try {
            const ph85 = await this.ph85Repo.findOne({ where: { stt_rec } });
            const ct85List = await this.ct85Repo.find({
                where: { stt_rec },
                relations: ['vatTu'], // <-- join dmvt để lấy tên và đơn vị
            });

            if (!ph85) {
                throw new BadRequestException(`Không tìm thấy phiếu xuất điều chuyển với stt_rec: ${stt_rec}`);
            }

            return {
                phieu: ph85,
                vatTu: ct85List,
            };
        } catch (error) {
            throw new InternalServerErrorException('Lấy phiếu xuất điều chuyển thất bại');
        }
    }


    async updatePhieuXuat(dto: CreatePh85DtoWithVatTu, stt_rec: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            const { vatTu, phieu } = dto;
            const ma_ct = 'PXE';
            const ma_dvcs = 'CTY';
            const ngay_ct = new Date();
            await queryRunner.startTransaction();
            await queryRunner.manager.delete(Ct85Entity, {
                stt_rec,
            });
            await queryRunner.manager.update(
                Ph85Entity,
                { stt_rec },
                phieu,
            );
            if (vatTu.length === 0) {
                throw new BadRequestException('Chi tiết chứng từ không được để trống');
            }
            for (const item of vatTu) {
                console.log('Adding CT85 item:', item);
                const ct85 = queryRunner.manager.create(Ct85Entity, {
                    ...item,
                    stt_rec,
                    ma_ct,
                    ma_dvcs,
                    ngay_ct,
                });
                await queryRunner.manager.save(Ct85Entity, ct85);
            }
            await queryRunner.commitTransaction();
            try {
                await queryRunner.query(
                    `EXEC [dbo].[INCTPXE-CheckData] @status = @0, @mode = @1, @stt_rec = @2`,
                    [phieu.status, '1', stt_rec],
                );
                await queryRunner.query(
                    `EXEC GetTon13 @ma_kho = @0, @ma_vt = @1`,
                    [phieu.ma_kho, vatTu[0].ma_vt]
                );
                await queryRunner.startTransaction();
                await queryRunner.manager.update(
                    Ph85Entity,
                    { stt_rec },
                    {
                        t_so_luong: phieu.t_so_luong,
                        ty_gia: phieu.ty_gia,
                    },
                );
                await queryRunner.commitTransaction();
                await queryRunner.query(
                    `EXEC [dbo].[INCTPXE-Post] @stt_rec = @0`,
                    [stt_rec],
                );
            } catch (spError) {
                throw spError;
            }

            return { success: true, message: 'Cập nhật phiếu thành công' };
        } catch (err) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            console.error('Update Error:', err);
            throw new InternalServerErrorException('Cập nhật phiếu xuất điều chuyển thất bại');
        } finally {
            await queryRunner.release();
        }
    }

    async deletePhieuXuat(stt_rec: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const ma_ct = 'PXE';
            await queryRunner.manager.delete(Ct85Entity, { stt_rec });
            await queryRunner.manager.delete(Ph85Entity, { stt_rec });
            await queryRunner.query(
                `EXEC [dbo].[DeleteVoucher] @cMa_ct = @0,  @stt_rec = @1, @strList = @2`,
                [ma_ct, stt_rec, 'CT00,CT70'],
            );
            return { success: true, message: 'Xoá phiếu xuất điều chuyển thành công' };
        } catch (err) {
            console.error('Delete Error:', err);
            throw new InternalServerErrorException('Xoá phiếu xuất điều chuyển thất bại');
        } finally {
            await queryRunner.release();
        }
    }

    async getCt85BySttRec(stt_rec: string): Promise<Ct85Entity[]> {
        try {
            const rawData = await this.ct85Repo
                .createQueryBuilder('ct85')
                .where('RTRIM(ct85.stt_rec) = :stt_rec', { stt_rec })
                .getRawMany();
            const data = rawData.map(item => {
                const ct85 = new Ct85Entity();
                ct85.stt_rec = item.ct85_stt_rec;
                ct85.ma_vt = item.ct85_ma_vt;
                ct85.ma_ct = item.ct85_ma_ct;
                ct85.tk_vt = item.ct85_tk_vt;
                ct85.ma_nx_i = item.ct85_ma_nx_i;
                ct85.ngay_ct = item.ct85_ngay_ct;
                ct85.so_luong = item.ct85_so_luong;
                return ct85;
            });

            return data;
        } catch (error) {
            throw new InternalServerErrorException('Lỗi khi lấy dữ liệu chi tiết CT85');
        }
    }



}
