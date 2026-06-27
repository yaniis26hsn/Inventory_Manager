import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Min } from "class-validator";
import { User } from "../user/user.entity";

@Entity()

export class Provide {
@PrimaryGeneratedColumn()
idProvide : number ;

@Column()
userId : number ;

@ManyToOne(()=> User , {nullable : false} )
@JoinColumn({name : "userId"})
user : User

@Column()
@Min(0)
total : number ;
 
@Column({type : "timestamp" , default : () => "CURRENT_TIMESTAMP"})
  created_at : Date ;

}
