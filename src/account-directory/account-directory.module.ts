import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountDirectoryController } from "./account-directory.controller";
import { AccountDirectory } from "./account-directory.entity";
import { AccountDirectoryService } from "./account-directory.service";

@Module({
    imports: [TypeOrmModule.forFeature([AccountDirectory])],
    controllers: [AccountDirectoryController],
    providers: [AccountDirectoryService],
    exports: [AccountDirectoryService],
})
export class AccountDirectoryModule { }
