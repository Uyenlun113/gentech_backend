import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashReceiptService } from './CashReceipt.service';
import { CashReceiptController } from './CashReceipt.controller';
import { Ct41 } from './entity/ct41.entity';
import { Ph41 } from './entity/ph41.entity';
import { Ct00 } from './entity/ct00.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ct41, Ph41, Ct00])],
  providers: [CashReceiptService],
  controllers: [CashReceiptController],
  exports: [CashReceiptService],
})
export class CashReceiptModule {}
