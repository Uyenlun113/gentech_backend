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
                ...dto, ma_vt, date: new Date(),
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

}