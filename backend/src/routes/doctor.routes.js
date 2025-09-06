import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    createDoctor,
    deleteDoctor,
    getDetailsOfAllDoctor,
    getDetailsOfDoctor,
    updateDoctorDetails
} from "../controllers/doctor.controllers.js";

const router = Router()

router.route('/create-doctor').post(verifyJWT, createDoctor)
router.route("/getall-doctors").get(verifyJWT, getDetailsOfAllDoctor)
router.route("/getdetails/:doctorId").get(verifyJWT, getDetailsOfDoctor)
router.route("/updatedetails/:doctorId").put(verifyJWT, updateDoctorDetails)
router.route("/delete/:doctorId").delete(verifyJWT, deleteDoctor)

export default router;