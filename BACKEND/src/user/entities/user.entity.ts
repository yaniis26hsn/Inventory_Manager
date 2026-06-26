import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number ;

    @Column()
    fname : string ;

    @Column()
    lname : string 

    @Column()
    age: number

    @Column()
    role : Role ;

    @Column({default:true})
    status : boolean

    @Column({nullable:false})
    password : string 

    @Column()
    phone : number

}