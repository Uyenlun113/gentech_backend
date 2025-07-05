import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryCustomerController } from './category-customer.controller';
import { CategoryCustomerService } from './category_customer.service';
import { CustomerGroupController } from './customer-group.controller';
import { CustomerGroup } from './customer-group.entity';
import { CustomerGroupService } from './customer-group.service';
import { Customer } from './customer.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Customer, CustomerGroup])],
    controllers: [CategoryCustomerController, CustomerGroupController],
    providers: [CategoryCustomerService, CustomerGroupService],
    exports: [CategoryCustomerService, CustomerGroupService],
})
export class CategoryCustomerModule { }