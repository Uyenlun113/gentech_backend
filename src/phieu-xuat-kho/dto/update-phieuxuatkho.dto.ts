import { PartialType } from '@nestjs/mapped-types';
import { CreatePhieuXuatKhoDto } from './create-phieuxuatkho.dto';

export class UpdatePhieuXuatKhoDto extends PartialType(CreatePhieuXuatKhoDto) {}
