import { Controller, Get, Query } from "@nestjs/common";
import { productService } from "./product.service";

@Controller('products')
export class ProductController {
  constructor(private readonly service: productService) {}

  @Get()
  findAll(@Query() filters: Record<string, any>) {
    return this.service.findAll(filters);
  }

  @Get('verify-storage')
  verifyStorage() {
    return this.service.verifyStorage();
  }

  @Get('out-of-stock')
  outOfStock() {
    return this.service.findOutOfStock();
  }
}
