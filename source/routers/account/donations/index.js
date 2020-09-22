// Core
import dg from 'debug';

// Instruments
import { Account } from '../../../controllers';

const debug = dg('router:account:donations');

export const getDonationsById = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const { vk_user_id } = req.query;

    const model = new Account({ vk_user_id });
    const data = await model.getDonationsById();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const postDonations = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const model = new Account(req.body);
    const data = await model.create();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
