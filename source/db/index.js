// Core
import mongoose from 'mongoose';
import dg from 'debug';

// Instruments
import { getDB } from '../utils';

const debug = dg('db');
const { DB_URL, DB_PORT, DB_NAME } = getDB();

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
};

const connection = mongoose.connect(
  `mongodb+srv://${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`,
  mongooseOptions
);

connection
  .then(() => {
    debug(`DB ${DB_NAME} connected`);
  })
  .catch(({ message }) => {
    debug(`DB ${DB_NAME} connected error ${message}`);
  });
