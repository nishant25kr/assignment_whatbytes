import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"
import Doctor from "../models/doctor.models.js";

const generateAccessandRefreshToken = async (userId) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!accessToken) {
        throw new ApiError(500, "Failed to generate access token");
    }

    if (!refreshToken) {
        throw new ApiError(500, "Failed to generate refresh token");
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (name === "") {
        throw new ApiError(400, "name is empty");
    }
    if (email === "") {
        throw new ApiError(400, "email is empty");
    }
    if (password === "") {
        throw new ApiError(400, "password is empty");
    }

    const existUser = await User.findOne({ email })

    if (existUser) {
        throw new ApiError(404, "User already exist with this email");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const usercreate = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!usercreate) {
        throw new ApiError(500, "Something went wrong while registring the user");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, user, "User created successfully"));
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) throw new ApiError(401, "Email cannot be empty");
    if (!password) throw new ApiError(401, "Password cannot be empty");

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, "User not available");
    }

    const passwordCheck = await user.isPasswordCorrect(password);

    if (!passwordCheck) {
        throw new ApiError(400, "Password is incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

    const LoggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const option = {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                { LoggedInUser }, // optional: remove tokens from response
                "User login successful"
            )
        );
});

const currentUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) throw new ApiError(500, "UserId is not available")

    const user = await User.findById(userId).select("-password -refreshToken")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user },
                "User fetched successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized access");
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: "" },
        },
        { new: true }
    );

    const option = {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
    };


    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});


export {
    registerUser,
    loginUser,
    currentUser,
    logoutUser,
}