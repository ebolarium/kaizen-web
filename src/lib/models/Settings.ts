import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISocialMedia {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
}

export interface ISettings extends Document {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    socialMedia: ISocialMedia;
    updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
    {
        siteName: {
            type: String,
            required: [true, 'Site name is required'],
            default: 'Kaizen Education NGO',
        },
        siteDescription: {
            type: String,
            default: 'Continuous improvement through education and community development',
        },
        contactEmail: {
            type: String,
            required: [true, 'Contact email is required'],
            default: 'info@kaizen.org',
        },
        socialMedia: {
            facebook: {
                type: String,
                default: '',
            },
            twitter: {
                type: String,
                default: '',
            },
            linkedin: {
                type: String,
                default: '',
            },
            instagram: {
                type: String,
                default: '',
            },
        },
    },
    {
        timestamps: { createdAt: false, updatedAt: true },
    }
);

// Prevent model recompilation in development
const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
