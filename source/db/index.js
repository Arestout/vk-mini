// Core
import mongoose from 'mongoose';
import dg from 'debug';

// Instruments
// import { getDB } from '../utils';

const debug = dg('db');
// const { DB_URL, DB_PORT, DB_NAME } = getDB();
const DB_URL = process.env.DB_URL || process.env.MONGODB_URL;

const mongooseOptions = {
  promiseLibrary: global.Promise,
  poolSize: 50,
  keepAlive: 30000,
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: false,
  retryWrites: true,
  w: 'majority',
};

export const connection = mongoose.connect(
  `mongodb+srv://${DB_URL}/vk-app?retryWrites=true&w=majority`,
  mongooseOptions
);

connection
  .then(() => {
    debug(`DB vk-app connected`);
  })
  .catch(({ message }) => {
    debug(`DB vk-app connected error ${message}`);
  });
