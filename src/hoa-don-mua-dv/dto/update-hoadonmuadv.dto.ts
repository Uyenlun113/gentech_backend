import { PartialType } from '@nestjs/mapped-types';
import { CreateHoaDonMuaDVDto } from './create-hoadonmuadv.dto';

export class UpdateHoaDonMuaDVDto extends PartialType(CreateHoaDonMuaDVDto) {}
