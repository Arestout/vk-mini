// Core
import dg from 'debug';

// Instruments
import { Account } from '../../../controllers';

const debug = dg('router:account:achievements');

export const getPointsById = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const { vk_user_id } = req.query;

    const model = new Account({ vk_user_id });
    const data = await model.getPointsById();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const postWallPoints = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const { vk_user_id } = req.query;
    const {
      data: { post_id },
    } = req.body;

    if (!post_id) {
      res.status(400).json({ message: 'Публикация не подтверждена' });
    }
    const model = new Account({ vk_user_id });
    const data = await model.postWallPoints();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const postStoriesPoints = async (req, res) => {
  debug(`${req.method} - ${req.originalUrl}`);

  try {
    const { vk_user_id } = req.query;
    const {
      data: { story_id },
    } = req.body;

    if (!story_id) {
      res.status(400).json({ message: 'Публикация не подтверждена' });
    }
    const model = new Account({ vk_user_id });
    const data = await model.postStoriesPoints();

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
