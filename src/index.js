import * as dotenv from "dotenv";
dotenv.config();
import app from "./server";
import db from "./database/models/index";

app.listen(process.env.PORT, () => {
  console.log(`-->Port ${process.env.PORT}: the server is up and running!`);
});

(async () => {
  try {
    await db.sequelize
      .sync()
      .then(() => console.log("-->connected to the db"));
  } catch (error) {
    console.log("Error connecting to the db:", error.message);
