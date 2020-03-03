"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const body_parser_1 = __importDefault(require("body-parser"));
const nuxt_1 = require("nuxt");
const passport_2 = __importDefault(require("./config/passport"));
const persons_1 = require("./routes/persons");
const auth_1 = require("./routes/auth");
class Server {
    constructor() {
        this._app = express_1.default();
        this._port = process.env.PORT || 3000;
    }
    run() {
        require('dotenv').config();
        this._app.use(body_parser_1.default.json());
        this._app.use(body_parser_1.default.urlencoded({ extended: true }));
        this._app.use(passport_1.default.initialize());
        passport_2.default(passport_1.default);
        this._app.use('/api/persons', passport_1.default.authenticate('jwt', { session: false }), persons_1.persons);
        this._app.use('/api/auth', auth_1.auth);
        let config = require('./../nuxt.config.js');
        config.dev = !(process.env.NODE_ENV === 'production');
        const nuxt = new nuxt_1.Nuxt(config);
        if (config.dev) {
            const builder = new nuxt_1.Builder(nuxt);
            builder.build();
        }
        this._app.use(nuxt.render);
        this._app.use(function (err, req, res, next) {
            res.status(500).send('Something broke!');
        });
        this._app.listen(this._port, () => {
            console.log("Server is running on " + this._port + " port");
        });
        return;
    }
    static getInstance() {
        if (this._instance) {
            return this._instance;
        }
        else {
            this._instance = new Server();
            return this._instance;
        }
    }
}
exports.default = Server;
