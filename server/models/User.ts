import bcrypt from 'bcrypt';
import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  Index,
  Unique,
  Length,
  IsEmail,
  BeforeCreate,
  BeforeUpdate
} from "sequelize-typescript";

@Table
export class User extends Model<User> {
  @Column
  firstName!: string;

  @Column
  lastName!: string;

  @IsEmail
  @Unique
  @Index
  @Column
  email!: string;

  @Length({ min: 6 })
  @Column
  password!: string;

  @BeforeCreate
  @BeforeUpdate
  static async bcryptPassword(instance: User) {
    instance.password = await bcrypt.hash(instance.password, 8);
  }

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
