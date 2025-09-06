import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    address: {
        type: String,
        trim: true
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    emergencyContact: {
        name: { type: String, trim: true },
        relation: { type: String, trim: true },
        phoneNumber: { type: String, trim: true }
    },
    medicalHistory: [
        {
            condition: { type: String, trim: true },   
            diagnosisDate: { type: Date },
            notes: { type: String, trim: true }
        }
    ],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);
