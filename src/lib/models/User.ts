import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
    forgotPasswordToken?: string;
    forgotPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        role: {
            type: String,
            enum: ['admin', 'editor', 'viewer'],
            default: 'admin',
        },
        forgotPasswordToken: {
            type: String,
            default: null,
        },
        forgotPasswordExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
