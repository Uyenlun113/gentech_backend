import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountDirectoryModule } from './account-directory/account-directory.module';
import { AuthModule } from './auth/auth.module';
import { CategoryCustomerModule } from './category-customer/category-customer.module';
import { GeneralAccountingModule } from './general-accounting/general-accounting.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      extra: {
        server: 'localhost\\SQLEXPRESS',
        options: {
          encrypt: false,
          trustServerCertificate: true,
          enableArithAbort: true,
        },
      },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
    }),
    AuthModule,
    CategoryCustomerModule,
    AccountDirectoryModule,
    GeneralAccountingModule

  ],
})
export class AppModule { }
