import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Provide } from "./provide.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Provide])],
  providers: [],
  controllers: [],
})
export class ProvideModule {}
