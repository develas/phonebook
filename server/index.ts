import Server from './server';
import {sequelize} from './sequelize';

(async () => {
  await sequelize.sync({force: true});

  Server.getInstance().run();
})();
