import { Column, Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { MinLength, MaxLength } from "class-validator";
import { Role } from "../common/enums/role.enum";
@Entity()
export class User {
@PrimaryGeneratedColumn()
idU : number ;

@Column()
age : number  ;

@Column()
role : Role

@Column()
fname : string ;

@Column()
lname : string ;
 
@Column({ unique: true })
username : string ; 

@Column()
@MinLength(8)
@MaxLength(32)
password : string ;


}
