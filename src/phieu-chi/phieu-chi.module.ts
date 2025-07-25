import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ph46Entity } from './entity/ph46.entity';
import { Ct46Entity } from './entity/ct46.entity';
import { Ct46gtEntity } from './entity/ct46gt.entity';
import { Ct00Entity } from 'src/general-accounting/entity/ct00.entity';
import { Ct46AccountingController } from './phieu-chi.controller';
import { Ct46AccountingService } from './phieu-chi.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            Ph46Entity,
            Ct46Entity,
            Ct46gtEntity,
            Ct00Entity,
        ]),
    ],
    controllers: [Ct46AccountingController],
    providers: [Ct46AccountingService],
    exports: [Ct46AccountingService],
})
export class Ct46AccountingModule { }