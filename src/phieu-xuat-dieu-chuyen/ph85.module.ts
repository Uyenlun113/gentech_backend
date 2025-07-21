import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ct85Entity } from './entity/ct85.entity';
import { Ph85Entity } from './entity/ph85.entity';
import { Ph85Controller } from './ph85.controller';
import { Ph85Service } from './ph85.service';

@Module({
    imports: [TypeOrmModule.forFeature([Ct85Entity, Ph85Entity])],
    controllers: [Ph85Controller],
    providers: [Ph85Service],
    exports: [Ph85Service],
})
export class Ph85Module { }
