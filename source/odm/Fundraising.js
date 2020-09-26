import mongoose from 'mongoose';
import { projects } from './Projects';
import { users } from './Users';

const FundraisingSchema = new mongoose.Schema({
  vk_user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users',
  },
  project_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: projects,
  },
  fragment: {
    type: String,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  sum: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: users,
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  modified_at: {
    type: Date,
    default: Date.now,
  },
});

export const fundraising = mongoose.model('fundraising', FundraisingSchema);
