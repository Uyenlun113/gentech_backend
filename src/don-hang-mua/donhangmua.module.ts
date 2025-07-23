import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonhangmuaController } from './donhangmua.controller';
import { DonhangmuaService } from './donhangmua.service';
import { Dmhdm } from './entity/dmhdm.entity';
import { Dmhdmct } from './entity/dmhdmct.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dmhdm, Dmhdmct])],
  controllers: [DonhangmuaController],
  providers: [DonhangmuaService],
})
export class DonHangMuaModule {}