import dotenv from "dotenv";
dotenv.config();


import ConnectDb from "./db/db.js"
import { app } from "./app.js";

ConnectDb()
    .then(() => {
        app.listen(`${process.env.PORT}` || 5000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("Error while connecting to DB : ", error)
    })