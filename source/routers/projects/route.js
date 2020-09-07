// Core
import dg from 'debug';

// Instruments
import { Projects } from '../../controllers';

const debug = dg('router:projects');

export const get = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const model = new Projects();
    const data = await model.getAll(req.query);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
