import { PartialType } from '@nestjs/mapped-types';
import { CreateHoaDonXuatKhoDto } from './create-hoadonxuatkho.dto';

export class UpdateHoaDonXuatKhoDto extends PartialType(CreateHoaDonXuatKhoDto) {}
