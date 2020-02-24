import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User';
import { Phone } from './models/Phone';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  database: 'phonebook',
  storage: ':memory:',
  models: [User, Phone]
});
