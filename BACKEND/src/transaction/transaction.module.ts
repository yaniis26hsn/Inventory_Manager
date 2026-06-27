import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Transaction } from "./transaction.entity";

@Module({
imports : [TypeOrmModule.forFeature([Transaction])] ,
providers : [] ,
controllers : [] ,

})
export class TransactionModule {}