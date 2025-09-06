import dotenv from "dotenv";
dotenv.config();

import ConnectDb from "./db/db.js";
import {app} from "./app.js"

const PORT = process.env.PORT || 8080;

ConnectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error while connecting to DB:", error);
  });
