import { Model, Column, Table, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from "sequelize-typescript";
import { Person } from './Person';

@Table
export class Phone extends Model<Phone> {
  @Column
  phoneNumber!: string;

  @ForeignKey(() => Person)
  @Column
  personId!: number;

  @BelongsTo(() => Person)
  person!: Person;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
