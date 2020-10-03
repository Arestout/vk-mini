//Instruments
import { NotFoundError } from '../utils';
import { fundraising, projects, users } from '../odm';

export class Fundraising {
  constructor(data) {
    this.data = data;
  }

  async create() {
    const { project_id, vk_user_id } = this.data;

    const project = await projects.findOne({ id: project_id });
    const user = await users.findOne({ vk_user_id });

    const newFundraising = await fundraising.create({
      ...this.data,
      project: project._id,
      vk_user: user._id,
      status: 'ACTIVE',
      created_at: Date.now(),
    });

    user.points += 2;
    await user.save();

    return newFundraising;
  }

  async getFundraisingByUserId() {
    const { vk_user_id } = this.data;
    const user = await users.findOne({ vk_user_id });

    const data = await fundraising
      .find({ vk_user: user._id })
      .populate('project', '-_id -__v')
      .populate('vk_user', '-_id -__v')
      .populate('users_donated', '-_id -__v')
      .select('-__v')
      .lean();

    if (!data) {
      throw new NotFoundError(`у пользователя ${vk_user_id} нет доброфонов`);
    }

    return data;
  }

  async getFundraisingById() {
    const { fundraising_id } = this.data;
    const data = await fundraising
      .findOne({ _id: fundraising_id })
      .populate('project', '-_id -__v')
      .populate('vk_user', '-_id -__v')
      .populate('users_donated', '-_id -__v')
      .select('-__v')
      .lean();

    if (!data) {
      throw new NotFoundError(`нет доброфонов с id ${fundraising_id}`);
    }

    return data;
  }

  //   async removeByTransactionId() {
  //     const { transaction_id } = this.data;

  //     const data = await donations.findOneAndDelete({ transaction_id });

  //     if (!data) {
  //       throw new NotFoundError(
  //         `can not find document with transaction id ${transaction_id}`
  //       );
  //     }

  //     return data;
  //   }
}
