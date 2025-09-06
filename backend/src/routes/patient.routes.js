import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { 
    createPatient, 
    getDetailsOfAllPatient,
    getDetailsOfPatient,
    updatePatientDetails,
    deletePatient,
 } from "../controllers/patient.controllers.js";


const router = Router()

router.route("/create-patient").post(verifyJWT,createPatient)
router.route("/getall-patients").get(verifyJWT,getDetailsOfAllPatient)
router.route("/getdetails/:patientId").get(verifyJWT,getDetailsOfPatient)
router.route("/updatedetails/:patientId").put(verifyJWT,updatePatientDetails)
router.route("/delete/:patientId").delete(verifyJWT,deletePatient)

export default router;