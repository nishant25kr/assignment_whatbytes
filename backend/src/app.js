import express, { json } from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser';

const app = express();

app.use(json()) 

app.use(cors({
  origin: "*", 
  credentials: true
}));

app.use(cookieParser())

app.get('/', (req, res) => {
  res.send(`Hello this is backend from whatbytes`)
})

//routes
import userRouter from "./routes/user.routes.js"
import patientRouter from "./routes/patient.routes.js"
import doctorRouter from "./routes/doctor.routes.js"
import appointmentRouter from "./routes/appointment.routes.js"

//route declaration
app.use("/api/auth",userRouter)
app.use('/api/patient',patientRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/mappings',appointmentRouter)


export { app }
