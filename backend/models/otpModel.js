const mongoose = require("mongoose");
// schema for OTP
const otpSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    otpToken: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        enum: ["verify-email", "reset-password"],
        required: true,
    }
},
    {timestamps: true}

);
// model otp
const otpModel = mongoose.model("otps", otpSchema);

module.exports = otpModel;