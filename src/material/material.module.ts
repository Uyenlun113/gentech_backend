import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialController } from './material.controller';
import { Material } from './material.entity';
import { MaterialService } from './material.service';


@Module({
    imports: [TypeOrmModule.forFeature([Material])],
    controllers: [MaterialController],
    providers: [MaterialService],
    exports: [MaterialService]
})
export class MaterialModule { }