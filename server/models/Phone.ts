import { Model, Column, Table, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from "sequelize-typescript";
import { User } from './User';

@Table
export class Phone extends Model<Phone> {
  @Column
  phoneNumber!: string;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
