import { Sequelize } from 'sequelize-typescript';
import { Person } from './models/Person';
import { Phone } from './models/Phone';
import { User } from './models/User';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  database: 'phonebook',
  storage: ':memory:',
  models: [User, Person, Phone]
});
