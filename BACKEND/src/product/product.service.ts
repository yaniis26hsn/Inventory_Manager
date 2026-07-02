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

  async findAll(filters: Record<string, any>) {
    const qb = this.repository.createQueryBuilder('product');

    for (const [key, value] of Object.entries(filters)) {
      if (key.endsWith('_min')) {
        const field = key.slice(0, -4);
        qb.andWhere(`product.${field} >= :${key}`, { [key]: value });
      } else if (key.endsWith('_max')) {
        const field = key.slice(0, -4);
        qb.andWhere(`product.${field} <= :${key}`, { [key]: value });
      } else {
        qb.andWhere(`product.${key} LIKE :${key}`, { [key]: `%${value}%` });
      }
    }

    return await qb.getMany();
  }
}

