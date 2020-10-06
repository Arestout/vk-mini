import mongoose from 'mongoose';

const ProjectsSchema = new mongoose.Schema({
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
  path: {
    type: String,
    required: true,
  },
  html: {
    type: String,
  },
  gallery: {
    type: String,
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

export const projects = mongoose.model('projects', ProjectsSchema);
