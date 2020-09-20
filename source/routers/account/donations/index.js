// Core
import dg from 'debug';

// Instruments
import { Donations } from '../../../controllers';

const debug = dg('router:account:donations');

export const getDonationsById = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const { user_id } = req.query;

    const model = new Donations({ user_id });
    const data = await model.getDonationsById();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const postDonations = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const model = new Donations(req.body);
    const data = await model.create();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
