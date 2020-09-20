//Instruments
import { donations, projects } from '../odm';

export class Donations {
  constructor(data) {
    this.data = data;
  }

  async create() {
    const { project_id } = this.data;
    const project = await projects.findOne({ id: project_id });

    const donation = await donations.create({
      ...this.data,
      project_id: project._id,
    });

    return donation;
  }

  //   async addDonation() {
  //     const { id, payload } = this.data;

  //     const data = await donations.findOneAndUpdate(
  //         { id },
  //         { $addToSet: { '': payload } },
  //         { new: true },
  //     );

  //     if (!data) {
  //         throw new NotFoundError(`can not find document with hash ${hash}`);
  //     }

  //     return data;
  // }

  async getDonationsById() {
    const { user_id } = this.data;

    const data = await donations
      .find({ user_id })
      .populate('project_id', '-_id -__v')
      .select('-__v -id')
      .lean();

    if (!data) {
      return 'Нет добрых дел :(';
    }

    return data;
  }

  async removeByTransactionId() {
    const { transaction_id } = this.data;

    const data = await lessons.findOneAndDelete({ transaction_id });

    if (!data) {
      throw new NotFoundError(
        `can not find document with transaction id ${transaction_id}`
      );
    }

    return data;
  }
}
