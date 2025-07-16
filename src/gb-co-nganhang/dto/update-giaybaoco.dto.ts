import { PartialType } from '@nestjs/mapped-types';
import { CreateGiayBaoCoDto } from './create-giaybaoco.dto';

export class UpdateGiayBaoCoDto extends PartialType(CreateGiayBaoCoDto) {}
