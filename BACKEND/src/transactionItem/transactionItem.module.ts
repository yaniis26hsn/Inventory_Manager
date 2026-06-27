import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionItem } from "./transactionItem.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TransactionItem])],
  providers: [],
  controllers: [],
})
export class TransactionItemModule {}
