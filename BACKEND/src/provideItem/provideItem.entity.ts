import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Min } from "class-validator";
import { Provide } from "../Provide/provide.entity";
import { Product } from "../product/product.entity";

@Entity()
export class ProvideItem {
  @PrimaryColumn()
  provideId: number;

  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => Provide, { nullable: false })
  @JoinColumn({ name: "provideId" })
  provide: Provide;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column()
  @Min(1)
  quantity: number;

  @Column()
  @Min(0)
  unitPrice: number;
}