import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
    postId: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    date: Date;
    tags: string[];
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema = new Schema(
    {
        postId: {
            type: String,
            required: [true, 'Post ID is required'],
            unique: true,
            trim: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        excerpt: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        image: {
            type: String,
            default: '/images/blog/default.jpg',
        },
        author: {
            type: String,
            default: 'Admin',
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        tags: {
            type: [String],
            default: [],
        },
        published: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
PostSchema.index({ postId: 1 });
PostSchema.index({ published: 1 });
PostSchema.index({ date: -1 });

// Prevent model recompilation in development
const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
