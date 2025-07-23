import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountDirectoryModule } from './account-directory/account-directory.module';
import { AuthModule } from './auth/auth.module';
import { CategoryCustomerModule } from './category-customer/category-customer.module';
import { CdtkModule } from './cdtk/cdtk.module';
import { CdvtModule } from './cdvt/cdvt.module';
import { DmkhoModule } from './dmkho/dmkho.module';
import { DmsttModule } from './dmstt/dmstt.module';
import { DmvuviecModule } from './dmvuviec/dmvuviec.module';
import { GiayBaoCoModule } from './gb-co-nganhang/giaybaoco.module';
import { GiayBaoNoModule } from './gb-no-nganhang/giaybaono.module';
import { GeneralAccountingModule } from './general-accounting/general-accounting.module';
import { MaterialModule } from './material/material.module';
import { Ct46AccountingModule } from './phieu-chi/phieu-chi.module';
import { PhieuNhapKhoModule } from './phieu-nhap-kho/phieu-nhap-kho.module';
import { Ph85Module } from './phieu-xuat-dieu-chuyen/ph85.module';
import { PhieuXuatKhoModule } from './phieu-xuat-kho/phieu-xuat-kho.module';
import { CashReceiptModule } from './SupportingDocuments/CashReceipt/CashReceipt.module';
import { phieuMuaModule } from './phieu-nhap-mua/phieu-mua.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
      },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
    }),
    AuthModule,
    CategoryCustomerModule,
    AccountDirectoryModule,
    GeneralAccountingModule,
    CashReceiptModule,
    MaterialModule,
    DmkhoModule,
    DmvuviecModule,
    Ct46AccountingModule,
    GiayBaoCoModule,
    GiayBaoNoModule,
    PhieuNhapKhoModule,
    PhieuXuatKhoModule,
    DmsttModule,
    CdtkModule,
    Ph85Module,
    CdvtModule,
    phieuMuaModule
  ],
})
export class AppModule { }
