import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    specialization: {
        type: String,
        required: true
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
    department: {
        type: String,
        required: true
    },
    yearsOfExperience: Number,
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    }

}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
