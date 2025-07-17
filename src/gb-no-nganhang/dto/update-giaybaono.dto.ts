import { PartialType } from '@nestjs/mapped-types';
import { CreateGiayBaoNoDto } from './create-giaybaono.dto';

export class UpdateGiayBaoNoDto extends PartialType(CreateGiayBaoNoDto) {}
