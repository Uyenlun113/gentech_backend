import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePh85Dto } from './dto/CreatePh85Dto';
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

    async createPhieuXuat(dto: CreatePh85Dto) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { ct85List, ...ph85Data } = dto;
            const ma_ct = 'PXE';
            const stt_rec = `APXE${Date.now()}`.substring(0, 11);
            const ma_dvcs = 'CTY';

            // 2. Insert PH85
            const ph85 = queryRunner.manager.create(Ph85Entity, { ...ph85Data, ma_ct, stt_rec, ma_dvcs });
            await queryRunner.manager.save(Ph85Entity, ph85);

            // 3. Insert CT85
            if (ct85List.length === 0) {
                throw new BadRequestException('Chi tiết chứng từ không được để trống');
            }

            for (const item of ct85List) {
                const ct85 = queryRunner.manager.create(Ct85Entity, { ...item, stt_rec, ma_ct, ma_dvcs });
                await queryRunner.manager.save(Ct85Entity, ct85);
            }

            // 4. Check tồn kho
            await queryRunner.query(
                `EXEC [dbo].[INCTPXE-CheckData] @status = ?, @mode = ?, @stt_rec = ?`,
                [ph85Data.status, '1', stt_rec],
            );

            await queryRunner.query(`EXEC GetTon13 @ma_kho = ?, @ma_vt = ?`, [
                ph85Data.ma_kho,
                ct85List[0].ma_vt,
            ]);

            // 5. Update PH85 với tổng số lượng, tỷ giá (nếu có)
            await queryRunner.manager.update(
                Ph85Entity,
                { stt_rec },
                {
                    t_so_luong: ph85Data.t_so_luong,
                    ty_gia: ph85Data.ty_gia,
                },
            );

            // 6. Gọi lại Post chứng từ
            await queryRunner.query(
                `EXEC [dbo].[INCTPXE-Post] @stt_rec = ?, @stt_rec = ?`,
                [stt_rec, stt_rec],
            );

            // Commit transaction
            await queryRunner.commitTransaction();
            return {
                success: true,
                message: 'Tạo phiếu xuất điều chuyển thành công',
                data: ph85
            };
        } catch (err) {
            await queryRunner.rollbackTransaction();
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
            const ct85List = await this.ct85Repo.find({ where: { stt_rec } });
            if (!ph85) {
                throw new BadRequestException(`Không tìm thấy phiếu xuất điều chuyển với stt_rec: ${stt_rec}`);
            }
            return {
                phieu: ph85,
                vatTu: ct85List,
            }
        } catch (error) {
            throw new InternalServerErrorException('Lấy phiếu xuất điều chuyển thất bại');
        }
    }

    async updatePhieuXuat(dto: CreatePh85Dto, stt_rec: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { ct85List, ...ph85Data } = dto;

            // 1. Check chứng từ hợp lệ
            await queryRunner.query(
                `EXEC [CheckValidSodct#3] @Ma_qs = ?, @So_ct = ?, @Ma_qs = ?, @So_ct = ?`,
                [ph85Data.ma_ct, ph85Data.status, ph85Data.ma_ct, ph85Data.status],
            );

            // 2. Xoá hết chi tiết cũ ct85
            await queryRunner.manager.delete(Ct85Entity, {
                stt_rec,
            });

            // 3. Cập nhật thông tin ph85 (header)
            await queryRunner.manager.update(
                Ph85Entity,
                { stt_rec },
                ph85Data,
            );

            // 4. Thêm lại danh sách ct85 mới
            if (ct85List.length === 0) {
                throw new BadRequestException('Chi tiết chứng từ không được để trống');
            }

            for (const item of ct85List) {
                const ct85 = queryRunner.manager.create(Ct85Entity, item);
                await queryRunner.manager.save(Ct85Entity, ct85);
            }

            // 5. Gọi CheckData
            await queryRunner.query(
                `EXEC [dbo].[INCTPXE-CheckData] @status = ?, @mode = ?, @stt_rec = ?`,
                [ph85Data.status, '1', stt_rec],
            );

            // 6. Gọi GetTon13
            await queryRunner.query(`EXEC GetTon13 @ma_kho = ?, @ma_vt = ?`, [
                ph85Data.ma_kho,
                ct85List[0].ma_vt,
            ]);

            // 7. Cập nhật lại tổng số lượng và tỷ giá nếu có thay đổi
            await queryRunner.manager.update(
                Ph85Entity,
                { stt_rec },
                {
                    t_so_luong: ph85Data.t_so_luong,
                    ty_gia: ph85Data.ty_gia,
                },
            );

            // 8. Gọi Post lại để cập nhật vào tồn kho
            await queryRunner.query(
                `EXEC [dbo].[INCTPXE-Post] @stt_rec = ?, @stt_rec = ?`,
                [stt_rec],
            );

            await queryRunner.commitTransaction();
            return { success: true, message: 'Cập nhật phiếu thành công' };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.error('Update Error:', err);
            throw new InternalServerErrorException('Cập nhật phiếu xuất điều chuyển thất bại');
        } finally {
            await queryRunner.release();
        }
    }

    async deletePhieuXuat(stt_rec: string) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const ma_ct = 'PXE';
            // 1. Xoá chi tiết ct85
            await queryRunner.manager.delete(Ct85Entity, { stt_rec });

            // 2. Xoá phiếu ph85
            await queryRunner.manager.delete(Ph85Entity, { stt_rec });

            // 3. Gọi Post để cập nhật tồn kho
            await queryRunner.query(
                `EXEC [dbo].[DeleteVoucher] @ma_ct = ?, @stt_rec = ?`,
                [ma_ct, stt_rec],
            );

            await queryRunner.commitTransaction();
            return { success: true, message: 'Xoá phiếu xuất điều chuyển thành công' };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.error('Delete Error:', err);
            throw new InternalServerErrorException('Xoá phiếu xuất điều chuyển thất bại');
        } finally {
            await queryRunner.release();
        }
    }

    async getCt85BySttRec(stt_rec: string): Promise<Ct85Entity[]> {
        try {
            const list = await this.ct85Repo.find({
                where: { stt_rec },
            });
            return list;
        } catch (error) {
            throw new InternalServerErrorException('Lỗi khi lấy dữ liệu chi tiết CT85');
        }
    }


}
