import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {Category}  from '../common/enums/category.enum';
import {Min} from 'class-validator';
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    idP: number ;
    
    @Column()
    name:string ;

    @Column({default : 0}) 
    @Min(0)
    quantity : number 

    @Column({default : 0}) 
    @Min(0)
    minQuantity : number 

    @Column() 
    @Min(0)
    price : number 

    @Column() 
    @Min(0)
    cost : number 

    @Column({unique:true})
    barcode : string 

    @Column()
    category : Category 

}
