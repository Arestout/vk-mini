// Core
import dg from 'debug';

// Instruments
import { Projects } from '../../../controllers';

const debug = dg('router:projects:singleProject');

export const getProject = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const model = new Projects();
    const data = await model.getProjectData(req.path);

    res.header('Access-Control-Allow-Origin', '*');
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
