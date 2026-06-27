import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Min } from "class-validator";
import { User } from "../user/user.entity";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  idT: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  @Min(0)
  Total: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}

