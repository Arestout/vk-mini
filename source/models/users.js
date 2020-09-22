// Instruments
import { users } from '../odm';
import { NotFoundError } from '../utils';

export class Users {
  constructor(data) {
    this.data = data;
  }

  async exists() {
    const { vk_user_id } = this.data;

    const doesUserExist = await users.exists({ vk_user_id });

    return doesUserExist;
  }

  async create() {
    const { vk_user_id } = this.data;

    const user = await users.create({
      vk_user_id,
      donations: [],
      points: 0,
    });

    return user;
  }
}
