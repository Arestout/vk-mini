import mongoose from 'mongoose';
import { donations } from './Donations';

const UserSchema = new mongoose.Schema({
  vk_user_id: {
    type: Number,
    required: true,
  },
  // donations: [
  //   {
  //     type: mongoose.SchemaTypes.ObjectId,
  //     ref: donations,
  //   },
  // ],
  points: {
    type: Number,
    required: true,
  },
});

export const users = mongoose.model('users', UserSchema);
