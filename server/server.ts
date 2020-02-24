import express from 'express'
import bodyParser from 'body-parser';
import { Nuxt, Builder } from 'nuxt'
import { users } from './routes/users'

export default class Server {
  public run(): void {
    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({ extended: true }))

    // Import routes
    this._app.use('/api/users', users);

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
