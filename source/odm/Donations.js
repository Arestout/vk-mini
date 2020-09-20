import mongoose from 'mongoose';

const DonationsSchema = new mongoose.Schema({
  vkId: {
    type: Number,
    required: true,
  },
  projectId: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const donations = mongoose.model('donations', DonationsSchema);
