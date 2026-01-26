import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChangeLog extends Document {
  action: 'created' | 'updated' | 'deleted';
  entity: 'project';
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChangeLogSchema: Schema = new Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ['created', 'updated', 'deleted'],
    },
    entity: {
      type: String,
      required: true,
      enum: ['project'],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

ChangeLogSchema.index({ createdAt: -1 });
ChangeLogSchema.index({ entity: 1 });

const ChangeLog: Model<IChangeLog> = mongoose.models.ChangeLog || mongoose.model<IChangeLog>('ChangeLog', ChangeLogSchema);

export default ChangeLog;
