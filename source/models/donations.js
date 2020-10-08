//Instruments
import { NotFoundError } from '../utils';
import { donations, projects, users, fundraising } from '../odm';

export class Donations {
  constructor(data) {
    this.data = data;
  }

  async create() {
    const { project_id, vk_user_id } = this.data;

    const project = await projects.findOne({ id: project_id });
    const user = await users.findOne({ vk_user_id });

    const donation = await donations.create({
      ...this.data,
      project_id: project._id,
      transaction_id: 125684894551388,
      status: 'PAID',
      created_at: Date.now(),
    });

    // const { _id } = donation;

    // user.donations.push({ _id });
    user.points += 1;
    await user.save();

    if (this.data.fundraising_id) {
      const { fundraising_id } = this.data;
      //   const oneFundraising = await fundraising.findOneAndUpdate(
      //     { _id: fundraising_id },
      //     {
      //       $inc: { sum: donation.amount },
      //       status: {
      //         $cond: [{ $gte: ['$sum', 50000] }, 'FINISHED', 'ACTIVE'],
      //       },
      //     }
      //   );
      // }
      console.log('TEST');
      user.fundraising_participate.push({ _id: fundraising_id });
      await user.save();
      const oneFundraising = await fundraising.findOne({ _id: fundraising_id });
      oneFundraising.sum += donation.amount;
      if (oneFundraising.sum >= oneFundraising.target) {
        oneFundraising.status = 'FINISHED';
      }
      oneFundraising.modified_at = Date.now();
      oneFundraising.users_donated.push(user._id);
      await oneFundraising.save();
    }
    return donation;
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
  }

  async getDonationsById() {
    const { vk_user_id } = this.data;

    const data = await donations
      .find({ vk_user_id })
      .populate('project_id', '-_id -__v')
      .select('-__v -id')
      .lean();

    // const data = await users
    //   .findOne({ user_id })
    //   .populate('donations', '-_id -__v')
    //   .select('-_id -__v')
    //   .lean();

    if (!data) {
      return [];
    }

    return data;
  }

  async removeByTransactionId() {
    const { transaction_id } = this.data;

    const data = await donations.findOneAndDelete({ transaction_id });

    if (!data) {
      throw new NotFoundError(
        `can not find document with transaction id ${transaction_id}`
      );
    }

    return data;
  }
}
