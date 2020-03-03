"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Person_1 = require("./models/Person");
const Phone_1 = require("./models/Phone");
const User_1 = require("./models/User");
exports.sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'sqlite',
    database: 'phonebook',
    storage: ':memory:',
    models: [User_1.User, Person_1.Person, Phone_1.Phone]
});
