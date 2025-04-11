

import mongoose, { Schema } from 'mongoose';
import { LTheme, IUser } from '../types';

const UserSchema = new Schema({
    profile: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (value: string) => /^\S+@\S+\.\S+$/.test(value),
                message: (props: any) => `${props.value} is not a valid email!`,
            },
        },
        avatar: {
            type: String,
            default: null,
        }
    },
    encryptedData: {
        type: String,
        default: "",
    },
    encryptedSecretKey: {
        type: String,
        default: "",
    }
}, { timestamps: true});

export default mongoose.model<IUser>('User', UserSchema);