import Patient from "../models/patient.models.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPatient = asyncHandler(async (req, res) => {
    const {
        name,
        phoneNumber,
        email,
        address,
        dob,
        gender,
        bloodGroup,
        emergencyContact,
        medicalHistory
    } = req.body

    if (!name) throw new ApiError(401, "Name cannot be empty")
    if (!phoneNumber) throw new ApiError(401, "phoneNumber cannot be empty")
    if (!email) throw new ApiError(401, "email cannot be empty")
    if (!address) throw new ApiError(401, "address cannot be empty")
    if (!dob) throw new ApiError(401, "dob cannot be empty")
    if (!gender) throw new ApiError(401, "gender cannot be empty")

    const newPatient = await Patient.create({
        name,
        phoneNumber,
        email,
        address,
        dob,
        gender,
        bloodGroup,
        emergencyContact,
        medicalHistory,
        addedBy: req.user?._id
    })

    if (!newPatient) {
        throw new ApiError(
            401,
            "Error while creating Patient"
        )
    }

    const patient = await Patient.findById(newPatient._id)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { patient },
                "Patient created successfully"
            )
        )

})

const getDetailsOfAllPatient = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorised access")
    }

    const AllPatients = await Patient.find()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { AllPatients },
                "All patient Details fetch successfully"
            )
        )

})

const getDetailsOfPatient = asyncHandler(async (req, res) => {
    const patientId = req.params.patientId?.trim()

    if (!patientId) {
        throw new ApiError(401, "Patient id is required")
    }

    const patient = await Patient.findById(patientId)

    if (!patient) {
        throw new ApiError(401, "Patient is not available in Db")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { patient },
                "Patient detail fetched successfully"
            )
        )
})

const updatePatientDetails = asyncHandler(async (req, res) => {
    const {
        newname,
        newphoneNumber,
        newemail,
        newaddress,
        newdob,
        newgender,
        newbloodGroup,
        newemergencyContact,
        newmedicalHistory
    } = req.body;

    const patientId = req.params.patientId?.trim();

    if (!patientId) {
        throw new ApiError(400, "Patient ID is required");
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
        patientId,
        {
            $set: {
                name: newname,
                phoneNumber: newphoneNumber,
                email: newemail,
                address: newaddress,
                dob: newdob,
                gender: newgender,
                bloodGroup: newbloodGroup,
                emergencyContact: newemergencyContact,
            },
            ...(newmedicalHistory ? { $push: { medicalHistory: newmedicalHistory } } : {})
        },
        { new: true }
    );

    if (!updatedPatient) {
        throw new ApiError(404, "Patient not found");
    }

    return res
        .status(200)
        .json(
            200,
            { updatedPatient },
            "User updated successfully"
        );
});

const deletePatient = asyncHandler(async (req, res) => {
    const patientId = req.params.patientId.trim()

    if (!patientId) {
        throw new ApiError(401, "Patient Id is not there")
    }

    const patient = await Patient.findById(patientId)

    if (!patient) {
        throw new ApiError(401, "Patient is not available in DB")
    }

    await patient.deleteOne()

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Patient deleted successfully"));

})

export {
    createPatient,
    getDetailsOfAllPatient,
    getDetailsOfPatient,
    updatePatientDetails,
    deletePatient,
    
}