import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Dmnhvt } from "./dmnhvt.entity";
import { CreateDmnhvtDto } from "./dto/create-dmnhvt.dto";

@Injectable()
export class dmnhvtService {
    constructor(
        @InjectRepository(Dmnhvt)
        private dmnhvtRepository: Repository<Dmnhvt>,
        private dataSource: DataSource
    ) { }
    async create(createDmnhvtDto: CreateDmnhvtDto) {
        try {
            const newData = this.dmnhvtRepository.create(createDmnhvtDto);
            const res = this.dmnhvtRepository.save(newData);
            return {
                message: 'Thêm nhóm vật tư thành công',
                data: res
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi thêm nhóm vật tư: ${error.message}`);
        }
    }

    async findAll() {
        try {
            const res = await this.dmnhvtRepository.find({});
            return {
                message: 'Lấy danh sách nhóm vật tư thành công',
                data: res
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi lấy danh sách nhóm vật tư: ${error.message}`);
        }
    }

    async findOne(loai_nh: number, ma_nh: string) {
        try {
            const res = await this.dmnhvtRepository.findOne({ where: { loai_nh, ma_nh: ma_nh.trim() } });
            if (!res) {
                throw new NotFoundException(`Không tìm thấy bản ghi với loai_nh=${loai_nh} và ma_nh=${ma_nh}`);
            }
            return {
                message: 'Lấy nhóm vật tư thành công',
                data: res
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Lỗi khi lấy nhóm vật tư: ${error.message}`);
        }
    }

    async update(loai_nh: number, ma_nh: string, updateDmnhvtDto: CreateDmnhvtDto) {
        try {
            const result = await this.dmnhvtRepository.update({ loai_nh, ma_nh: ma_nh.trim() }, updateDmnhvtDto);
            if (result.affected === 0) {
                throw new NotFoundException(`Không tìm thấy bản ghi với loai_nh=${loai_nh} và ma_nh=${ma_nh}`);
            }
            return {
                message: 'Cập nhật nhóm vật tư thành công',
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi cập nhật nhóm vật tư: ${error.message}`);
        }
    }

    async delete(loai_nh: number, ma_nh: string) {
        try {
            const result = await this.dmnhvtRepository.delete({ loai_nh, ma_nh: ma_nh.trim() });
            if (result.affected === 0) {
                throw new NotFoundException(`Không tìm thấy bản ghi với loai_nh=${loai_nh} và ma_nh=${ma_nh}`);
            }
            return {
                message: 'Xóa thành công!',
            };
        } catch (error) {
            throw new BadRequestException(`Lỗi khi xóa nhóm vật tư: ${error.message}`);
        }
    }
}