import { User } from "@xborg/shared/all/types";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from "typeorm";

@Entity("users")
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("uuid", { unique: true })
  @Generated("uuid")
  externalId!: string;

  @Column("text", { unique: true })
  googleId!: string;

  @Column("text", { unique: true })
  email!: string;

  @Column("text", { nullable: true })
  firstName!: string | null;

  @Column("text", { nullable: true })
  lastName!: string | null;

  @Column("text", { nullable: true })
  picture!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
