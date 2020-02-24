"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Sequelize = require('sequelize');
const User_1 = require("../models/User");
const Phone_1 = require("../models/Phone");
const utils_1 = require("../utils");
exports.users = express_1.Router();
const Op = Sequelize.Op;
exports.users.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phones = [] } = req.body;
    const user = yield User_1.User.create(req.body).catch((e => next(e)));
    if (phones.length) {
        const promises = phones.map(phoneNumber => Phone_1.Phone.create({ phoneNumber, userId: user['id'] }));
        yield Promise.all(promises).catch(e => next(e));
    }
    return res.status(201).json(user);
}));
exports.users.get('', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const phoneOptions = {
        model: Phone_1.Phone
    };
    const userQuery = {};
    if (req.query.phone) {
        Object.assign(phoneOptions, { where: { phoneNumber: { [Op.like]: `%${req.query.phone}%` } } });
    }
    if (req.query.firstName) {
        Object.assign(userQuery, { firstName: { [Op.like]: `%${req.query.firstName}%` } });
    }
    const users = yield User_1.User.findAll({
        where: Object.assign({}, userQuery),
        include: [phoneOptions]
    })
        .then(users => (users || []).map(user => utils_1.prepareResponse(user)))
        .catch(e => next(e));
    res.json(users);
}));
exports.users.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findByPk(req.params.id, {
        include: [
            {
                model: Phone_1.Phone,
                attributes: ['phoneNumber']
            }
        ]
    }).then(user => {
        if (user === null) {
            return res.status(404).end('User not found!');
        }
        return utils_1.prepareResponse(user);
    }).catch(e => { console.log('error', e); next(e); });
    res.json(user);
}));
exports.users.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phones: queryPhoneNumbers = [] } = req.body;
    const user = yield User_1.User.update(req.body, { where: { id: req.params.id } }).catch((e) => next(e));
    if (!user[0]) {
        return res.status(404).end('User not found!');
    }
    if (queryPhoneNumbers.length) {
        let promises;
        const dbPhoneNumbers = yield Phone_1.Phone.findAll({ where: { userId: req.params.id } }).catch(e => next(e));
        const { addNumbers = [], deleteNumbers = [] } = utils_1.composePhoneNumbers(dbPhoneNumbers, queryPhoneNumbers);
        if (addNumbers.length) {
            promises = addNumbers.map(phoneNumber => Phone_1.Phone.create({ phoneNumber, userId: req.params.id }));
        }
        if (deleteNumbers.length) {
            promises = [...promises, ...deleteNumbers.map(phoneNumber => Phone_1.Phone.destroy({ where: { phoneNumber } }))];
        }
        Promise.all(promises).then(() => res.sendStatus(200)).catch((e) => next(e));
    }
    else {
        res.sendStatus(200);
    }
}));
exports.users.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.destroy({ where: { id: req.params.id } }).catch((e) => next(e));
    if (!user) {
        return res.status(404).end('User not found!');
    }
    Phone_1.Phone.destroy({ where: { userId: req.params.id } }).catch((e) => next(e));
    res.sendStatus(200);
}));
