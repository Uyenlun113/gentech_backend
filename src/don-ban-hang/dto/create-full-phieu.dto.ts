import { Type } from 'class-transformer';
import { IsArray, IsObject, ValidateNested } from 'class-validator';
import { CreateDmhdDto } from './create-dmhd.dto';
import { CreateDmhdctDto } from './create-dmhdct.dto';

export class CreateFullPhieuDto {
    @ValidateNested()
    @Type(() => CreateDmhdDto)
    @IsObject()
    phieu: CreateDmhdDto;

    @ValidateNested({ each: true })
    @Type(() => CreateDmhdctDto)
    @IsArray()
    hangHoa: CreateDmhdctDto[];
}