import { Controller, Get } from "@nestjs/common";
import { productService } from "./product.service";

@Controller('products')
export class ProductController {
  constructor(private readonly service: productService) {}

  
  @Get('verify-storage')
  verifyStorage() {
    return this.service.verifyStorage();
  }

  @Get('out-of-stock')
  outOfStock() {
    return this.service.findOutOfStock();
  }
  @Get('all')
  findAll(){
    return this.service.findAll() 
  }
}
