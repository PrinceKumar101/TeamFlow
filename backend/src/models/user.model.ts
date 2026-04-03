import mongoose from 'mongoose';
import { string } from 'zod';
import { GlobalRole } from '../types/role.type.js';

const { Schema } = mongoose;

const refreshTokenSchema = new Schema({
  tokenId: { type: String, required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    refreshToken: refreshTokenSchema,

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: GlobalRole,
      default: GlobalRole.USER,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);
export default User;
