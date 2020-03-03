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
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
exports.auth = express_1.Router();
const createToken = (user) => jsonwebtoken_1.default.sign({ user }, process.env.SECRET || 'my_jwt_secret', { expiresIn: '15m' });
exports.auth.post('/login', (req, res, next) => {
    passport_1.default.authenticate('local', { session: false }, (err, user) => {
        if (err)
            next(err);
        if (!user)
            res.status(401).json({ message: 'Incorrect username or password.' });
        req.logIn(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            const token = createToken(user);
            return res.json({ user, token });
        });
    })(req, res, next);
});
exports.auth.post('/sign-up', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.create(req.body).catch(e => next(e));
    if (!user)
        next('Something was wrong!');
    return res.status(201).json({ success: true });
}));
