
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngiaController } from './tinh-gia-tbt.controller';
import { IngiaService } from './tinh-gia-tbt.service';

@Module({
    imports: [TypeOrmModule.forFeature([])],
    controllers: [IngiaController],
    providers: [IngiaService],
})
export class IngiaModule { }
