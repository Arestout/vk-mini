import mongoose from 'mongoose';
import { projects } from './Projects';
import { fundraising } from './Fundraising';

const DonationsSchema = new mongoose.Schema({
  vk_user_id: {
    type: Number,
    required: true,
  },
  project_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'projects',
  },
  amount: {
    type: Number,
    required: true,
  },
  transaction_id: {
    type: Number,
    required: true,
  },
  fundraising_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: fundraising,
  },
  status: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const donations = mongoose.model('donations', DonationsSchema);
