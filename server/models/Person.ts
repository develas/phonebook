import { Model, Column, Table, HasMany, CreatedAt, UpdatedAt } from "sequelize-typescript";
import { Phone } from './Phone';

@Table
export class Person extends Model<Person> {
  @Column
  firstName!: string;

  @Column
  lastName!: string;

  @HasMany(() => Phone)
  phones?: Phone[];

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
