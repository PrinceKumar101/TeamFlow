import mongoose, { Schema, Document, Types } from 'mongoose';
import { ProjectRole } from '../types/role.type.js';

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}



export interface IProjectMember {
  user: Types.ObjectId;
  role: ProjectRole;
}

export interface IProject extends Document {
  name: string;
  description?: string;

  createdBy: Types.ObjectId; // ADMIN

  members: IProjectMember[];

  status: ProjectStatus;

  createdAt: Date;
  updatedAt: Date;
}

const projectMemberSchema = new Schema<IProjectMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ProjectRole),
      required: true,
    },
  },
  { _id: false },
);

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    members: {
      type: [projectMemberSchema],
      default: [],
    },

    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.ACTIVE,
    },
  },
  { timestamps: true },
);
const Project =  mongoose.model<IProject>('Project', projectSchema) ;
export default Project
