"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./models/User");
const Phone_1 = require("./models/Phone");
exports.sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'sqlite',
    database: 'phonebook',
    storage: ':memory:',
    models: [User_1.User, Phone_1.Phone]
});
