import { PartialType } from '@nestjs/mapped-types';
import { CreateCashReceiptDto } from './create-cash-receipt.dto';

export class UpdateCashReceiptDto extends PartialType(CreateCashReceiptDto) {}
