// ingia.service.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IngiaTbDto } from './tinh-gia-tbt.dto';

@Injectable()
export class IngiaService {
    constructor(@InjectDataSource() private dataSource: DataSource) { }

    async callIngiaTb(dto: IngiaTbDto) {
        const result = await this.dataSource.query(
            `EXEC Ingia_tb 
        @Period1 = @0, 
        @Year1 = @1, 
        @Period2 = @2, 
        @Year2 = @3, 
        @Ma_kho = @4, 
        @Ma_dvcs = @5, 
        @Ma_vt = @6, 
        @Ma_vv = @7, 
        @OutMa_vts = @8, 
        @Tk_vt = @9, 
        @Nh_vt1 = @10, 
        @Nh_vt2 = @11, 
        @Nh_vt3 = @12, 
        @Nh_sc = @13, 
        @Dk_cl = @14, 
        @Tinh_giatb = @15`,
            [
                dto.Period1,
                dto.Year1,
                dto.Period2,
                dto.Year2,
                dto.Ma_kho ?? '',
                dto.Ma_dvcs ?? '',
                dto.Ma_vt ?? '',
                dto.Ma_vv ?? '',
                dto.OutMa_vts ?? '',
                dto.Tk_vt ?? '',
                dto.Nh_vt1 ?? '',
                dto.Nh_vt2 ?? '',
                dto.Nh_vt3 ?? '',
                dto.Nh_sc ?? '',
                dto.Dk_cl ?? '',
                dto.Tinh_giatb ?? '',
            ],
        );
        return result;
    }
}
