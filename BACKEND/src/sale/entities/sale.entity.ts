import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity
export class Sale{
    @PrimaryGeneratedColumn()
    Sid:number ;

    @Column()
    


}