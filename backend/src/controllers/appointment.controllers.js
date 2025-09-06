import Patient from "../models/patient.models.js";
import Doctor from "../models/doctor.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import Appointment from "../models/appointment.models.js";

const createAppointment = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(400, "Unauthorized access");
    }

    const patientId = req.params.patientId?.trim();
    const doctorId = req.params.doctorId?.trim();

    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    console.log(patient)
    console.log(doctor)

    if (!patient) {
        throw new ApiError(400, "Invalid patient Id");
    }

    if (!doctor) {
        throw new ApiError(400, "Invalid doctor Id");
    }
    console.log("hi")

    const existAppointment = await Appointment.findOne({
        patient: patientId,
        doctor: doctorId,
        
    });

    if (existAppointment) {
        throw new ApiError(400, "Appointment is already scheduled");
    }

    const appointment = await Appointment.create({
        patient: patientId,
        doctor: doctorId,
        patientdetails: {
            name: patient.name,
            phoneNumber: patient.phoneNumber,
            email: patient.email,
            address: patient.address,
            dob: patient.dob,
            gender: patient.gender,
            bloodGroup: patient.bloodGroup,
            emergencyContact: patient.emergencyContact,
            medicalHistory: patient.medicalHistory,
        },
        doctorDetails: {
            name: doctor.name,
            phoneNumber: doctor.phoneNumber,
            email: doctor.email,
            specialization: doctor.specialization,
            department: doctor.department,
        },
    });

    if (!appointment) {
        throw new ApiError(400, "Error while creating appointment");
    }

    const createdAppointment = await Appointment.findById(appointment._id);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createdAppointment,
                "Appointment created successfully"
            )
        );
});

const getAllAppointment = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized access")
    }

    const appointemt = await Appointment.find()

    if(!appointemt){
        throw new ApiError(401,"No appointment available")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {appointemt},
                "Appointment fetched successfullt"
            )
        )

})

const getAllDoctorAssigned = asyncHandler(async(req,res) => {

    if(!req.user){
        throw new ApiError(401,"Unauthorized access")
    }
    const patientId = req.params.patientId?.trim()
    console.log(patientId)

    const doctors = await Appointment.find({patient:patientId}).select('doctor doctorDetails')
    console.log(doctors)

    if(!doctors){
        throw new ApiError(401,"No appointment is there")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
            {doctors},
            "doctors fetched successfully"
            ) 
        )


})

const removeAssignedDoctor  = asyncHandler(async(req,res)=>{
    if(!req.user){
        throw new ApiError(200,"Unauthorized access")
    }

    const patientId = req.params?.patientId.trim()
    const doctorId = req.params?.doctorId.trim()

    const appointment = await Appointment.findOneAndDelete({
        patient:patientId,
        doctor:doctorId
    })

    if(!appointment){
        throw new ApiError(401,"No appointment available")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Appointment deleted successfullt"
            )
        )




})

export { 
    createAppointment,
    getAllAppointment,
    getAllDoctorAssigned,
    removeAssignedDoctor
};
