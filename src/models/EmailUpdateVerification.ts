import mongoose, { Schema } from "mongoose";
import { IEmailUpdateVerification } from "../types";

const emailValidator = (value: string) => /^\S+@\S+\.\S+$/.test(value);

const EmailUpdateVerificationSchema = new Schema({
    previousEmail: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: emailValidator,
            message: (props: any) => `${props.value} is not a valid email!`,
        },
    },
    newEmail: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: emailValidator,
            message: (props: any) => `${props.value} is not a valid email!`,
        }
    },
    otp: {
        type: String,
        required: true,
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

export default mongoose.model<IEmailUpdateVerification>('EmailUpdateVerification', EmailUpdateVerificationSchema);