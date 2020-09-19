import mongoose from 'mongoose';

const DbProjectsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const DbProjects = mongoose.model('projects', DbProjectsSchema);
