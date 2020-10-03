// Core
import dg from 'debug';

// Instruments
import { Fundraising } from '../../../controllers';

const debug = dg('router:account:fundraising');

export const getFundraisingByUserId = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const { vk_user_id } = req.query;

    const model = new Fundraising({ vk_user_id });
    const data = await model.getFundraisingByUserId();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFundraisingById = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const { fundraising_id } = req.query;

    const model = new Fundraising({ fundraising_id });
    const data = await model.getFundraisingById();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getActiveFundraisingCountByUserId = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const { vk_user_id } = req.query;

    const model = new Fundraising({ vk_user_id });
    const data = await model.getActiveFundraisingCountByUserId();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const postNewFundraising = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const model = new Fundraising(req.body);
    const data = await model.createFundraising();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
