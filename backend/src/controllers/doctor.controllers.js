import Doctor from "../models/doctor.models.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createDoctor = asyncHandler(async (req, res) => {
    const {
        name,
        phoneNumber,
        email,
        specialization,
        department,

    } = req.body

    if (!name) throw new ApiError(401, "Name cannot be empty")
    if (!phoneNumber) throw new ApiError(401, "phoneNumber cannot be empty")
    if (!email) throw new ApiError(401, "email cannot be empty")
    if (!specialization) throw new ApiError(401, "address cannot be empty")
    if (!department) throw new ApiError(401, "dob cannot be empty")

    const newDoctor = await Doctor.create({
        name,
        phoneNumber,
        email,
        specialization,
        department,
        addedBy: req.user?._id
    })

    if (!newDoctor) {
        throw new ApiError(
            401,
            "Error while creating Patient"
        )
    }

    const doctor = await Doctor.findById(newDoctor._id)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { doctor },
                "Doctor created successfully"
            )
        )

})

const getDetailsOfAllDoctor = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorised access")
    }

    const AllDoctor = await Doctor.find()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { AllDoctor },
                "All patient Details fetch successfully"
            )
        )

})

const getDetailsOfDoctor = asyncHandler(async (req, res) => {
    const DoctorId = req.params.doctorId?.trim()

    if (!DoctorId) {
        throw new ApiError(401, "Patient id is required")
    }

    const doctor = await Doctor.findById(DoctorId)

    if (!doctor) {
        throw new ApiError(401, "Patient is not available in Db")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { doctor },
                "Doctor detail fetched successfully"
            )
        )
})

const updateDoctorDetails = asyncHandler(async (req, res) => {
    const {
        newname,
        newphoneNumber,
        newemail,
        newspecialization,
        newdepartment,
    } = req.body;

    const doctorId = req.params.doctorId?.trim();

    if (!doctorId) {
        throw new ApiError(400, "Doctor ID is required");
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
        doctorId,
        {
            $set: {
                name: newname,
                phoneNumber: newphoneNumber,
                email: newemail,
                specialization: newspecialization,
                department: newdepartment
            }
        },
        { new: true }
    );

    if (!updatedDoctor) {
        throw new ApiError(404, "Patient not found");
    }

    return res
        .status(200)
        .json(
            200,
            { updatedDoctor },
            "User updated successfully"
        );
});

const deleteDoctor = asyncHandler(async (req, res) => {
    const doctorId = req.params.doctorId.trim()

    if (!doctorId) {
        throw new ApiError(401, "Doctor Id is not there")
    }

    const doctor = await Doctor.findById(doctorId)

    if (!doctor) {
        throw new ApiError(401, "Doctor is not available in DB")
    }

    await doctor.deleteOne()

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Doctor deleted successfully"));

})

export {
    createDoctor,
    getDetailsOfAllDoctor,
    getDetailsOfDoctor,
    updateDoctorDetails,
    deleteDoctor,
}