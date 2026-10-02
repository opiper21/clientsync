import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  tag: string;
  color: string;
  comments: number;
  status: string;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    tag: { type: String, default: 'Feature' },
    color: { type: String, default: 'bg-blue-500' },
    comments: { type: Number, default: 0 },
    status: { type: String, default: 'in-progress' },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', taskSchema);