import { Body, Controller, Post } from '@nestjs/common';
import { IngiaTbDto } from './tinh-gia-tbt.dto';
import { IngiaService } from './tinh-gia-tbt.service';


@Controller('ingia')
export class IngiaController {
    constructor(private readonly ingiaService: IngiaService) { }

    @Post('call')
    async callProcedure(@Body() dto: IngiaTbDto) {
        return this.ingiaService.callIngiaTb(dto);
    }
}