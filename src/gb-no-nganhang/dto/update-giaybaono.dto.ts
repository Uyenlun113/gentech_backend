import { PartialType } from '@nestjs/mapped-types';
import { CreateGiayBaoCoDto } from './create-giaybaono.dto';

export class UpdateGiayBaoCoDto extends PartialType(CreateGiayBaoCoDto) {}
