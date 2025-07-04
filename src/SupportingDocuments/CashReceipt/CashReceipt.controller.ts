import { Controller, Post, Put, Body, Param, Get, Query, Delete } from '@nestjs/common';
import { CashReceiptService } from './CashReceipt.service';
import { CreateCashReceiptDto } from './dto/create-cash-receipt.dto';
import { UpdateCashReceiptDto } from './dto/update-cash-receipt.dto';

@Controller('cash-receipt')
export class CashReceiptController {
  constructor(private readonly cashReceiptService: CashReceiptService) {}


  @Post()
  async create(@Body() dto: CreateCashReceiptDto) {
    return this.cashReceiptService.create(dto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.cashReceiptService.findAll(query);
  }

  @Put(':stt_rec')
  async update(@Param('stt_rec') stt_rec: string, @Body() dto: UpdateCashReceiptDto) {
    return this.cashReceiptService.update(stt_rec, dto);
  }

  @Delete(':stt_rec')
  async remove(@Param('stt_rec') stt_rec: string) {
    return this.cashReceiptService.remove(stt_rec);
  }
}
