import { PartialType } from '@nestjs/mapped-types';
import { CreateDonHangMuaDto } from './create-donhangmua.dto';

export class UpdateDonhangmuaDto extends PartialType(CreateDonHangMuaDto) {}