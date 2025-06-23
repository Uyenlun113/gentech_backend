import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryCustomerController } from './category-customer.controller';
import { Customer } from './customer.entity';
import { CategoryCustomerService } from './category_customer.service';


@Module({
    imports: [TypeOrmModule.forFeature([Customer])],
    controllers: [CategoryCustomerController],
    providers: [CategoryCustomerService],
    exports: [CategoryCustomerService],
})
export class CategoryCustomerModule { }