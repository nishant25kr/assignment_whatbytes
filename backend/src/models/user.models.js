import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,

    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider === "local";
        }
    },
    refreshToken: {
        type: String
    },
    userType: {
        type: String,
        default: "User"
    },
    provider: {
        type: String,
        enum: ["local", "google", "facebook"],
        default: "local",
    },

}, { timestamps: true })

//this method will check the password is correct ot not 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//this method will generate the accessToken when user is login
userSchema.methods.generateAccessToken = function () {

    return jwt.sign(
        {

            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//this method will generate the refreshToken when user is login
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export default mongoose.model("User", userSchema)