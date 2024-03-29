/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable linebreak-style */
import * as dotenv from 'dotenv';
import db from './database/models/index';
import { CroneJobs } from './jobs/index.js';
import { ioConnect, ioConnectNotifications } from './utils/socket';
import app from './server';

dotenv.config();
const server = app.listen(process.env.PORT, () => {
  console.log(`-->Port ${process.env.PORT}: the server is up and running!`);
});

(async () => {
  try {
    await db.sequelize.sync().then(() => console.log('-->connected to the db'));
  } catch (error) {
    console.log('Error connecting to the db:', error.message);
  }
})();

ioConnect(server);
