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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sequelize_1 = __importDefault(require("sequelize"));
const Person_1 = require("../models/Person");
const Phone_1 = require("../models/Phone");
const utils_1 = require("../utils");
exports.persons = express_1.Router();
const Op = sequelize_1.default.Op;
exports.persons.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phones = [] } = req.body;
    const person = yield Person_1.Person.create(req.body).catch(e => next(e));
    if (phones.length) {
        const promises = phones.map((phoneNumber) => Phone_1.Phone.create({ phoneNumber, userId: person['id'] }));
        yield Promise.all(promises).catch(e => next(e));
    }
    return res.status(201).json(person);
}));
exports.persons.get('', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const phoneOptions = {
        model: Phone_1.Phone
    };
    const personQuery = {};
    if (req.query.phone) {
        Object.assign(phoneOptions, { where: { phoneNumber: { [Op.like]: `%${req.query.phone}%` } } });
    }
    if (req.query.firstName) {
        Object.assign(personQuery, { firstName: { [Op.like]: `%${req.query.firstName}%` } });
    }
    const persons = yield Person_1.Person.findAll({
        where: Object.assign({}, personQuery),
        include: [phoneOptions]
    })
        .then((persons = []) => persons.map((person) => utils_1.prepareResponse(person)))
        .catch(e => next(e));
    res.json(persons);
}));
exports.persons.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const person = yield Person_1.Person.findByPk(req.params.id, {
        include: [
            {
                model: Phone_1.Phone,
                attributes: ['phoneNumber']
            }
        ]
    }).then(person => {
        if (person === null) {
            return res.status(404).end('Person not found!');
        }
        return utils_1.prepareResponse(person);
    }).catch(e => next(e));
    res.json(person);
}));
exports.persons.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phones: queryPhoneNumbers = [] } = req.body;
    const person = yield Person_1.Person.update(req.body, { where: { id: req.params.id } }).catch((e) => next(e));
    if (!person[0]) {
        return res.status(404).end('Person not found!');
    }
    if (queryPhoneNumbers.length) {
        let promises;
        const dbPhoneNumbers = yield Phone_1.Phone.findAll({ where: { userId: req.params.id } })
            .catch(e => next(e));
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
exports.persons.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const person = yield Person_1.Person.destroy({ where: { id: req.params.id } }).catch((e) => next(e));
    if (!person) {
        return res.status(404).end('Person not found!');
    }
    Phone_1.Phone.destroy({ where: { userId: req.params.id } }).catch((e) => next(e));
    res.sendStatus(200);
}));
