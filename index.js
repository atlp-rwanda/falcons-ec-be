import * as dotenv from "dotenv";
dotenv.config();
import app from "./server.js";

app.listen(process.env.PORT, () => {
  console.log(`-->Port ${process.env.PORT}: the server is up and running!`);
});
