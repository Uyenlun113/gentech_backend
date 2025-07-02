import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountDirectoryController } from "./account-directory.controller";
import { AccountDirectoryService } from "./account-directory.service";
import { AccountDirectory } from "./entity/account-directory.entity";
import { AccountGroup } from './entity/account-group.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AccountDirectory, AccountGroup])],
    controllers: [AccountDirectoryController],
    providers: [AccountDirectoryService],
    exports: [AccountDirectoryService],
})
export class AccountDirectoryModule { }
