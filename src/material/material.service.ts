import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateMaterialDto } from './dto/create-material.dto';
import { QueryMaterialDto } from './dto/query-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from './material.entity';

@Injectable()
export class MaterialService {
    constructor(
        @InjectRepository(Material)
        private materialRepository: Repository<Material>,
        private dataSource: DataSource
    ) { }
    //danh sách danh mục hàng hóa , vật tư
    async findAll(queryDto: QueryMaterialDto) {
        const { page = 1, limit = 10, search, status, loai_vt, vt_ton_kho } = queryDto;
        try {
            const queryBuilder = this.materialRepository.createQueryBuilder('material');
            if (search) {
                queryBuilder.where(
                    '(material.ma_vt LIKE :search OR material.ten_vt LIKE :search OR material.part_no LIKE :search)',
                    { search: `%${search}%` }
                );
            }
            if (status) {
                if (search) {
                    queryBuilder.andWhere('material.status = :status', { status });
                } else {
                    queryBuilder.where('material.status = :status', { status });
                }
            }
            if (loai_vt) {
                queryBuilder.andWhere('material.loai_vt = :loai_vt', { loai_vt });
            }
            if (vt_ton_kho !== undefined) {
                queryBuilder.andWhere('material.vt_ton_kho = :vt_ton_kho', { vt_ton_kho });
            }
            const [data, total] = await queryBuilder
                .orderBy('material.ma_vt', 'ASC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi lấy danh sách vật tư: ${error.message}`);
        }
    }
    // thêm mới danh mục hàng hóa, vật tư
    async create(dto: CreateMaterialDto) {
        try {
            const ma_vt = await this.generateNextMaterialCode();
            await this.dataSource.query(
                `EXEC CheckStringContainDM @table_name = @0, @table_key = @1, @new_value = @2, @old_value = @3`,
                ['dmvt', 'ma_vt', ma_vt, '']
            );
            const material = this.materialRepository.create({
                ma_vt,
                ten_vt: dto.ten_vt,
                part_no: dto.part_no,
                ten_vt2: dto.ten_vt2,
                dvt: dto.dvt,
                dvt1: dto.dvt1,
                he_so1: dto.he_so1,
                vt_ton_kho: dto.vt_ton_kho || 1,
                gia_von: dto.gia_von || 0,
                tk_vt: dto.tk_vt,
                tk_gv: dto.tk_gv,
                tk_dt: dto.tk_dt,
                tk_tl: dto.tk_tl,
                tk_spdd: dto.tk_spdd,
                nh_vt1: dto.nh_vt1,
                nh_vt2: dto.nh_vt2,
                nh_vt3: dto.nh_vt3,
                sl_min: dto.sl_min || 0,
                sl_max: dto.sl_max || 0,
                status: dto.status || 'A',
                sua_tk_vt: dto.sua_tk_vt || 0,
                tk_cl_vt: dto.tk_cl_vt,
                tk_dtnb: dto.tk_dtnb,
                ghi_chu: dto.ghi_chu,
                ma_td1: dto.ma_td1,
                ma_td2: dto.ma_td2,
                ma_td3: dto.ma_td3,
                ngay_td3: dto.ngay_td3,
                sl_td1: dto.sl_td1,
                sl_td2: dto.sl_td2,
                sl_td3: dto.sl_td3,
                gc_td1: dto.gc_td1,
                gc_td2: dto.gc_td2,
                gc_td3: dto.gc_td3,
                ma_khond: dto.ma_khond,
                ma_khon2: dto.ma_khon2,
                thuend: dto.thuend,
                thue_nknd: dto.thue_nknd,
                loai_vt: dto.loai_vt,
                ma_tra_cuu: dto.ma_tra_cuu,
                tk_nvl: dto.tk_nvl,
                tk_ck: dto.tk_ck,
                tk_km: dto.tk_km,
                date: new Date(),
                time: new Date().toTimeString().substring(0, 8),
            });
            const savedMaterial = await this.materialRepository.save(material);
            return {
                message: 'Thêm vật tư thành công',
                ma_vt,
                data: savedMaterial
            };
        } catch (error) {
            if (error.message?.includes('trùng') || error.message?.includes('duplicate')) {
                throw new BadRequestException('Mã vật tư đã tồn tại hoặc bị trùng lồng');
            }
            throw new BadRequestException(`Lỗi khi tạo vật tư: ${error.message}`);
        }
    }
    // cập nhật danh mục hàng hóa, vật tư
    async update(ma_vt: string, dto: UpdateMaterialDto) {
        try {
            const existingMaterial = await this.findOne(ma_vt);
            await this.dataSource.query(
                `EXEC CheckStringContainDM @table_name = @0, @table_key = @1, @new_value = @2, @old_value = @3`,
                ['dmvt', 'ma_vt', ma_vt, ma_vt]
            );
            Object.assign(existingMaterial, dto);
            existingMaterial.date0 = new Date();
            existingMaterial.time0 = new Date().toTimeString().substring(0, 8);
            const updatedMaterial = await this.materialRepository.save(existingMaterial);
            return {
                message: 'Cập nhật vật tư thành công',
                ma_vt,
                data: updatedMaterial
            };

        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException(`Lỗi khi cập nhật vật tư: ${error.message}`);
        }
    }
    // xóa danh mục hàng hóa, vật tư
    // kiểm tra mã vật tư có đang được sử dụng trong các chứng từ khác hay không
    async remove(ma_vt: string) {
        try {
            const material = await this.findOne(ma_vt);
            const checkResult = await this.dataSource.query(
                `EXEC CheckDeleteListId @ma_dm = @0, @value = @1`,
                ['dmvt', ma_vt]
            );
            if (checkResult && checkResult[0] && checkResult[0][''] === 0) {
                throw new BadRequestException('Không thể xóa vật tư này vì đang được sử dụng trong các chứng từ khác');
            }
            await this.materialRepository.remove(material);
            return { message: 'Xóa vật tư thành công', ma_vt };

        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Lỗi khi xóa vật tư: ${error.message}`);
        }
    }
    // lấy thông tin chi tiết vật tư theo mã
    async findOne(ma_vt: string): Promise<Material> {
        try {
            const material = await this.materialRepository.findOne({
                where: { ma_vt }
            });
            if (!material) {
                throw new NotFoundException(`Không tìm thấy vật tư với mã: ${ma_vt}`);
            }
            return material;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Lỗi khi tìm vật tư: ${error.message}`);
        }
    }

    private async generateNextMaterialCode(): Promise<string> {
        try {
            const latestMaterial = await this.materialRepository
                .createQueryBuilder('material')
                .where("material.ma_vt LIKE 'VT%'")
                .andWhere("ISNUMERIC(SUBSTRING(material.ma_vt, 3, LEN(material.ma_vt))) = 1")
                .orderBy("CAST(SUBSTRING(material.ma_vt, 3, LEN(material.ma_vt)) AS INT)", "DESC")
                .limit(1)
                .getOne();

            if (!latestMaterial) {
                return 'VT001';
            }

            const latestNumber = parseInt(latestMaterial.ma_vt.substring(2));
            if (isNaN(latestNumber)) {
                return 'VT001';
            }

            return 'VT' + (latestNumber + 1).toString().padStart(3, '0');

        } catch (error) {
            return 'VT001';
        }
    }

    // Thêm method tìm kiếm theo barcode/part_no
    async findByPartNo(part_no: string): Promise<Material> {
        try {
            const material = await this.materialRepository.findOne({
                where: { part_no }
            });
            if (!material) {
                throw new NotFoundException(`Không tìm thấy vật tư với part number: ${part_no}`);
            }
            return material;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Lỗi khi tìm vật tư theo part number: ${error.message}`);
        }
    }


}