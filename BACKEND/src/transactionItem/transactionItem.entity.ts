import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Min } from "class-validator";
import { Transaction } from "../transaction/transaction.entity";
import { Product } from "../product/product.entity";

@Entity()
export class TransactionItem {
@PrimaryColumn()
productId : number ;

@PrimaryColumn()
transactionId : number ;

@ManyToOne(()=> Transaction , {nullable : false })
@JoinColumn({name : "transactionId"}) 
transaction : Transaction ; 

@ManyToOne(()=> Product , {nullable : false})
@JoinColumn({name : "productId"})
product : Product 

@Column()
@Min(1)
quantity : number 

@Column()
@Min(0)
unitPrice : number 



}



// Table TransactionItem {
//   productId integer [ref: > Product.idP]
//   idT integer [ref: > Transaction.idT]

//   quantity integer [note: "> 0"]
//   UnitPrice integer [note: ">= 0"]

//   indexes {
//     (idT, productId) [pk]
//   }
// }