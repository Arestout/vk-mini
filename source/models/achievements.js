// Instruments
import { users } from '../odm';
import { NotFoundError } from '../utils';

export class Achievements {
  constructor(data) {
    this.data = data;
  }

  async getPointsById() {
    const { vk_user_id } = this.data;

    const data = await users
      .findOne({ vk_user_id })
      .select('points')
      .lean();

    if (!data) {
      throw new NotFoundError(`can not find document with hash ${hash}`);
    }

    return data;
  }

  async postWallPoints() {
    const { vk_user_id } = this.data;

    const user = await users
      .findOneAndUpdate(
        { vk_user_id },
        {
          $inc: { points: 0.5 },
        },
        { new: true }
      )
      .select('-_id -__v')
      .lean();

    return user;
  }

  async postStoriesPoints() {
    const { vk_user_id } = this.data;

    const user = await users
      .findOneAndUpdate(
        { vk_user_id },
        {
          $inc: { points: 1 },
        },
        { new: true }
      )
      .select('-_id -__v')
      .lean();

    return user;
  }
}
