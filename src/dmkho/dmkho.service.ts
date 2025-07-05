import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Dmkho } from "./dmkho.entity";

export class DmkhoService {
    constructor(
        @InjectRepository(Dmkho)
        private readonly dmkhoRepository: Repository<Dmkho>) { }

    async findAll() {

    }
}