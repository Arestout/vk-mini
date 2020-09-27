import mongoose from 'mongoose';
import { projects } from './Projects';
import { users } from './Users';

const FundraisingSchema = new mongoose.Schema({
  vk_user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users',
  },
  project: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: projects,
  },
  fragment: {
    type: String,
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
    enum: ['ACTIVE', 'FINISHED'],
  },
  users_donated: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
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

// { typeKey: '$type' }
