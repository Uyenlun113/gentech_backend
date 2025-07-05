import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmkhoController } from './dmkho.controller';
import { Dmkho } from './dmkho.entity';
import { DmkhoService } from './dmkho.service';



@Module({
    imports: [TypeOrmModule.forFeature([Dmkho])],
    controllers: [DmkhoController],
    providers: [DmkhoService],
    exports: [DmkhoService]
})
export class DmkhoModule { }