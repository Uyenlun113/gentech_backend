import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CustomerGroupService } from "./customer-group.service";
import { CreateCustomerGroupDto } from "./dto/create_customer-group";
import { QueryCustomerDto } from "./dto/query-customer.dto";

@Controller('dmnhkh')
export class CustomerGroupController {
    constructor(private readonly customerGroupService: CustomerGroupService) { }
    @Get()
    findAll(@Query() query: QueryCustomerDto) {
        return this.customerGroupService.findAll(query);
    }

    @Post()
    create(@Body() dto: CreateCustomerGroupDto) {
        return this.customerGroupService.create(dto);
    }

    @Get(':ma_nh/:loai_nh')
    findOne(@Param('ma_nh') ma_nh: string, @Param('loai_nh') loai_nh: number) {
        return this.customerGroupService.findOne(ma_nh, loai_nh);
    }

    @Patch('update/:ma_nh/:loai_nh')
    update(@Param('ma_nh') ma_nh: string, @Param('loai_nh') loai_nh: number, @Body() dto: CreateCustomerGroupDto) {
        return this.customerGroupService.update(ma_nh, loai_nh, dto);
    }

    @Delete('delete/:ma_nh/:loai_nh')
    delete(@Param('ma_nh') ma_nh: string, @Param('loai_nh') loai_nh: number) {
        return this.customerGroupService.delete(ma_nh, loai_nh);
    }

}