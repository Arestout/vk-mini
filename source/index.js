// Core
import debug from 'debug';

// Instruments
import { app } from './server';
// import { getPort } from './utils';

// DB;
import './db';

const PORT = process.env.PORT || 5000;
const dg = debug('server:main');

app.listen(PORT, () => {
  dg(`Server API is running on port ${PORT}`);
});
