import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { productService } from "./product.service";
import { ProductController } from "./product.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [productService],
  controllers: [ProductController],
})
export class ProductModule {}
