import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    patientdetails: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
        strict: false
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    doctorDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
        strict: false
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    status: {
        type: String,
        enum: ["Scheduled", "Completed", "Cancelled"],
        default: "Scheduled"
    },
    notes: String,

}, { timestamps: true })

export default mongoose.model("Appointment", appointmentSchema)