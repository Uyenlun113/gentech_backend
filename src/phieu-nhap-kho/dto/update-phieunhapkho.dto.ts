import { PartialType } from '@nestjs/mapped-types';
import { CreatePhieuNhapKhoDto } from './create-phieunhapkho.dto';

export class UpdatePhieuNhapKhoDto extends PartialType(CreatePhieuNhapKhoDto) {}
