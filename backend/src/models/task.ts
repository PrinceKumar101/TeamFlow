import mongoose, { Schema, Document, Types } from 'mongoose';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ITask extends Document {
  title: string;
  description?: string;

  projectId: Types.ObjectId;
  parentTaskId?: Types.ObjectId | null; // 🔥 Self reference

  createdBy: Types.ObjectId; // PO or PM
  assignedTo: Types.ObjectId; // DEVELOPER

  status: TaskStatus;
  priority: TaskPriority;

  dueDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true, // 🔥 Important for project queries
    },

    // 🔥 NEW FIELD
    parentTaskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
      index: true, // 🔥 Important for subtask lookups
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },

    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },

    dueDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

taskSchema.index({ parentTaskId: 1, projectId: 1 });

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;