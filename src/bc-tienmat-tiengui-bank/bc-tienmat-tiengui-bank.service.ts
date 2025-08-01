import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CallStoreDto } from './dto/call-store.dto';

@Injectable()
export class BcTienmatTienguiBankService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    async callStore(dto: CallStoreDto) {
        try {
            const {
                store,
                tk,
                ngay_ct1,
                ngay_ct2,
                gop_tk,
                ma_dvcs,
            } = dto;

            // Tùy theo stored procedure yêu cầu tham số nào
            const hasGopTk = gop_tk == '0';

            const query = hasGopTk
                ? `EXEC sp_executesql 
          N'EXEC @store @tk, @ngay_ct1, @ngay_ct2, @gop_tk, @Ma_dvcs',
          N'@store varchar(10),@tk varchar(10),@ngay_ct1 smalldatetime,@ngay_ct2 smalldatetime,@gop_tk int,@Ma_dvcs varchar(10)',
          @store=@0, @tk=@1, @ngay_ct1=@2, @ngay_ct2=@3, @gop_tk=@4, @Ma_dvcs=@5`
                : `EXEC sp_executesql 
          N'EXEC @store @tk, @ngay_ct1, @ngay_ct2, @Ma_dvcs',
          N'@store varchar(10),@tk varchar(10),@ngay_ct1 smalldatetime,@ngay_ct2 smalldatetime,@Ma_dvcs varchar(10)',
          @store=@0, @tk=@1, @ngay_ct1=@2, @ngay_ct2=@3, @Ma_dvcs=@4`;

            const params = hasGopTk
                ? [store, tk, ngay_ct1, ngay_ct2, Number(gop_tk), ma_dvcs]
                : [store, tk, ngay_ct1, ngay_ct2, ma_dvcs];

            const data = await this.dataSource.query(query, params);
            return data;
        } catch (e) {
            throw new Error('Create ph74 failed: ' + e.message);
        }
    }
}