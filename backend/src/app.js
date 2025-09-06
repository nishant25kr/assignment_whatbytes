import express, { json } from 'express'
// import cors from "cors"
// import cookieParser from 'cookie-parser';

const app = express();


app.get('/', (req, res) => {
  res.send(`Hello this is backend from whatbytes`)
})


export { app }