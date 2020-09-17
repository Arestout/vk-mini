// Core
import dg from 'debug';

// Instruments
import { Projects } from '../../../controllers';

const debug = dg('router:projects:cities');

export const getCities = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const model = new Projects();
    const data = await model.getCities();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
