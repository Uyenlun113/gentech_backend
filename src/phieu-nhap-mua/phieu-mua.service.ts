import { InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ct00Entity } from "src/general-accounting/entity/ct00.entity";
import { DataSource, Repository } from "typeorm";
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

        try {
            const { phieu, ct71, ct71gt } = dto;
            const stt_rec = `APNA${Date.now()}`.substring(0, 11);
            const ma_dvcs = 'CTY';
            const ma_ct = 'PNA';
            // 1. CheckExistsHDvao
            await queryRunner.manager.query(`EXEC CheckExistsHDvao @0, @1, @2, @3, @4`, [
                phieu.stt_rect,
                ct71gt[0]?.so_ct0,
                ct71gt[0]?.so_seri0,
                ct71gt[0]?.ngay_ct0,
                ct71gt[0]?.ma_so_thue,
            ]);

            // 2. Insert PH71
            await queryRunner.manager.save(Ph71Entity, {
                ...phieu,
                stt_rec,
                ma_dvcs,
                ma_ct,
                ngay_ct: new Date(phieu.ngay_ct),
                ngay_lct: new Date(phieu.ngay_lct),
            });

            // 3. Delete + Insert CT71
            await queryRunner.manager.delete(Ct71Entity, { stt_rec: phieu.stt_rect });
            await queryRunner.manager.save(Ct71Entity, {
                ...ct71,
                stt_rec,
                ma_dvcs,
                ma_ct,
                });

            // 4. Delete + Insert CT71GT
            await queryRunner.manager.delete(Ct71GtEntity, { stt_rec: phieu.stt_rect });
            await queryRunner.manager.save(Ct71GtEntity, ct71gt);

            // 5. POCTPNA-CheckData
            await queryRunner.manager.query(`EXEC [dbo].[POCTPNA-CheckData] @0, @1`, ['2', phieu.stt_rect]);

            // 6. POCTPNA-Post
            await queryRunner.manager.query(`EXEC [POCTPNA-Post] @0`, [phieu.stt_rect]);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(error.message);
        } finally {
            await queryRunner.release();
        }
    }



}