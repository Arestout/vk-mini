// Core
import dg from 'debug';

//Instruments
import { donations } from '../odm';

const debug = dg('models:donations');

export class Donations {
  constructor(data) {
    this.data = data;
  }

  async create() {
    const data = await donations.create(this.data);

    return data;
  }

  async getById() {
    const { vkId } = this.data;

    const data = await classes
      .find({ vkId })
      .populate('projects.project', '-_id -__v')
      .select('-__v -id')
      .lean();

    if (!data) {
      return 'Нет добрых дел :(';
    }

    return data;
  }
}
