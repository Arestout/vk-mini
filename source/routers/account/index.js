// Core
import express from 'express';
import dg from 'debug';
import cors from 'cors';

// Instruments
import { checkHash } from '../../utils';

const debug = dg('router:account');

const router = express.Router();
router.use(cors());

const get = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    res.status(200).json('account data');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

router.get('/', [checkHash], get);

export { router as account };
