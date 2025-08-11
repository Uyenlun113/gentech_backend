import { PartialType } from '@nestjs/mapped-types';
import { fullDto } from './create-hoadonxuatkho.dto';

export class UpdateHoaDonXuatKhoDto extends PartialType(fullDto) { }
