import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { Repository, Raw } from "typeorm";  


@Injectable()
export class productService{
    constructor(
        @InjectRepository(Product)
        private readonly repository : Repository<Product> , ) {}
  async verifyStorage() {
    return await this.repository.find({
      where: { quantity: Raw('quantity < minQuantity') },
    });
  }

  async findOutOfStock() {
    return await this.repository.find({
        where : {quantity : 0} ,
    }) ;
  }
   async findAll(){
    return await this.repository.find() ;
   }
 
}

