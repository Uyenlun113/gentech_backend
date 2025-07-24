import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateCt73Dto } from './ct73.dto';
import { CreateCt73GtDto } from './ct73gt.dto';
import { CreatePh73Dto } from './ph73.dto';


export class CreateFullPh73Dto {
    @ValidateNested()
    @Type(() => CreatePh73Dto)
    phieu: CreatePh73Dto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCt73Dto)
    chiPhi: CreateCt73Dto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCt73GtDto)
    hdThue: CreateCt73GtDto[];
}
