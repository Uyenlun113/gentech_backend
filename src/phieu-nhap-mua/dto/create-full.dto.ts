import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateCt71Dto } from './ct71.dto';
import { CreateCt71GtDto } from './ct71gt.dto';
import { CreatePh71Dto } from './ph71.dto';

export class CreateFullPh71Dto {
    @ValidateNested()
    @Type(() => CreatePh71Dto)
    phieu: CreatePh71Dto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCt71Dto)
    hangHoa: CreateCt71Dto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCt71GtDto)
    hdThue: CreateCt71GtDto[];
}
