import * as dotenv from 'dotenv';
import db from './database/models/index';
import { CroneJobs } from './jobs/index.js';

dotenv.config();
import app from './server';
app.listen(process.env.PORT, () => {
  console.log(`-->Port ${process.env.PORT}: the server is up and running!`);
});

(async () => {
  try {
    await db.sequelize.sync().then(() => console.log('-->connected to the db'));
  } catch (error) {
    console.log('Error connecting to the db:', error.message);
  }
})();
