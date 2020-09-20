import mongoose from 'mongoose';
import { projects } from './';

const DonationsSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
  },
  project_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: projects,
  },
  amount: {
    type: Number,
    required: true,
  },
  transaction_id: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const donations = mongoose.model('donations', DonationsSchema);
