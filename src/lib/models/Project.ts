import mongoose, { Schema, Document, Model } from 'mongoose';

// Activity subdocument interface
export interface IActivity {
    activityId: string;
    content: string;
    images: string[];
}

// Project interface
export interface IProject extends Document {
    projectId: string;
    category: 'local' | 'k152' | 'k153' | 'ka210' | 'k220';
    title: string;
    description: string;
    content: string;
    image: string;
    gallery: string[];
    activities: IActivity[];
    date: Date;
    status: 'active' | 'completed' | 'ongoing';
    partners?: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Activity subdocument schema
const ActivitySchema: Schema = new Schema(
    {
        activityId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            default: [],
        },
    },
    { _id: false }
);

// Project schema
const ProjectSchema: Schema = new Schema(
    {
        projectId: {
            type: String,
            required: [true, 'Project ID is required'],
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: ['local', 'k152', 'k153', 'ka210', 'k220'],
                message: '{VALUE} is not a valid category',
            },
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '/images/Erasmus_Logo.png',
        },
        gallery: {
            type: [String],
            default: [],
        },
        activities: {
            type: [ActivitySchema],
            default: [],
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        status: {
            type: String,
            enum: {
                values: ['active', 'completed', 'ongoing'],
                message: '{VALUE} is not a valid status',
            },
            default: 'active',
        },
        partners: {
            type: [String],
            default: undefined,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
ProjectSchema.index({ projectId: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ date: -1 });

// Prevent model recompilation in development
const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
