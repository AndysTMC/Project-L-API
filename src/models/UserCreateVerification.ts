import mongoose, { Schema } from "mongoose";
import { IUserCreateVerification } from "../types";

const UserCreateVerificationSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) => /^\S+@\S+\.\S+$/.test(value),
            message: (props: any) => `${props.value} is not a valid email!`,
        },
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

export default mongoose.model<IUserCreateVerification>('UserCreateVerification', UserCreateVerificationSchema);