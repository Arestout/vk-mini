// Core
import express from 'express';
import passport from 'passport';

// Instruments
import { logger, NotFoundError } from './utils';
import vkPassport from './utils/auth/passport';

// Routers
import { projects, auth, account } from './routers';

// Passport
vkPassport(passport);

const app = express();

app.use(express.json({ limit: '10kb' }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    let body = null;

    if (req.method !== 'GET') {
      body = JSON.stringify(req.body, null, 2);
    }

    logger.debug(`${req.method} ${body ? `\n${body}` : ''}`);
    next();
  });
}

// Routers
app.use('/projects', projects);
app.use('/auth', auth);
app.use('/account', account);

app.use('*', (req, res, next) => {
  const error = new NotFoundError(
    `Can not find right route for method ${req.method} and path ${req.originalUrl}`
  );
  next(error);
});

export { app };
