import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";

import { 
    createAppointment,
    getAllAppointment,
    getAllDoctorAssigned,
    removeAssignedDoctor
} from "../controllers/appointment.controllers.js"

const router = Router()

router.route("/create-appointemt/:patientId/:doctorId").post(verifyJWT,createAppointment)
router.route("/getallappointment").get(verifyJWT,getAllAppointment)
router.route("/get-assigned-doctor/:patientId").get(verifyJWT,getAllDoctorAssigned)
router.route("/remove-assigned-doctor/:patientId/:doctorId").delete(verifyJWT,removeAssignedDoctor)

export default router;