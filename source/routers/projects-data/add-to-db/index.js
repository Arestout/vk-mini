// Core
import dg from 'debug';

// Instruments
import { Projects } from '../../../controllers';

const debug = dg('router:projects:add-to-db');

export const addToDb = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const model = new Projects();
    const data = await model.addToDb();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
