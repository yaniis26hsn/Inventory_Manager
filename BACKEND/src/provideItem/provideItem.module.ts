import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProvideItem } from "./provideItem.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProvideItem])],
  providers: [],
  controllers: [],
})
export class ProvideItemModule {}
