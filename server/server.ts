import express from 'express'
import passport from 'passport';
import bodyParser from 'body-parser';
import { Nuxt, Builder } from 'nuxt'

import initStrategies from './config/passport'
import { persons } from './routes/persons'
import { auth } from './routes/auth'

export default class Server {
  public run(): void {
    require('dotenv').config();

    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({ extended: true }))

    this._app.use(passport.initialize());
    initStrategies(passport);

    // Import routes
    this._app.use('/api/persons', passport.authenticate('jwt', {session: false}), persons);
    this._app.use('/api/auth', auth);

    let config = require('./../nuxt.config.js');
    config.dev = !(process.env.NODE_ENV === 'production');

    // Init Nuxt.js
    const nuxt = new Nuxt(config);

    // Build only in dev mode
    if (config.dev) {
        const builder = new Builder(nuxt);
        builder.build();
    }

    // Give nuxt middleware to express
    this._app.use(nuxt.render);

    // error handler
    this._app.use(function (err, req, res, next) {
        res.status(500).send('Something broke!')
    });

    // Listen the server
    this._app.listen(this._port, () => {
      console.log("Server is running on "+ this._port +" port");
    });

    return;
  }
  public static getInstance(): Server {
    if(this._instance) {
      return this._instance;
    }
    else {
      this._instance = new Server();
      return this._instance;
    }
  }

  protected constructor() {
    this._app = express();
    this._port = process.env.PORT || 3000;
  }
  // Express instance
  protected _app: any;

   // Server Configuration
   protected _port: number | string;

  private static _instance: Server;
}
