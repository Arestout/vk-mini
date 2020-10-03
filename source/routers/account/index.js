// Core
import express from 'express';
import dg from 'debug';
import cors from 'cors';

// Instruments
import { checkHash } from '../../utils';

import { getDonationsById, postDonations } from './donations';
import {
  getPointsById,
  postWallPoints,
  postStoriesPoints,
} from './achievements';
import {
  postNewFundraising,
  getFundraisingByUserId,
  getFundraisingById,
} from './fundraising';

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

router.get('/donations', [checkHash], getDonationsById);
router.post('/donations', [checkHash], postDonations);

router.get('/achievements', [checkHash], getPointsById);
router.post('/achievements/wall', [checkHash], postWallPoints);
router.post('/achievements/stories', [checkHash], postStoriesPoints);

router.get('/fundraising', [checkHash], getFundraisingByUserId);
router.get('/fundraising/:id', [checkHash], getFundraisingById);
router.post('/fundraising', [checkHash], postNewFundraising);

export { router as account };
