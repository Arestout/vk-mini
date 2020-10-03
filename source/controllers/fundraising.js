// Instruments
import {
  Achievements as AchievementsModel,
  Donations as DonationsModel,
  Users as UsersModel,
  Fundraising as FundraisingModel,
} from '../models';

export class Fundraising {
  constructor(data) {
    this.models = {
      users: new UsersModel(data),
      fundraising: new FundraisingModel(data),
    };
  }

  async createUser() {
    await this.models.users.create();
  }

  async createFundraising() {
    const doesUserExist = await this.models.users.exists();

    if (!doesUserExist) {
      await this.createUser();
    }

    const data = await this.models.fundraising.create();

    return data;
  }

  async getFundraisingById() {
    const data = await this.models.fundraising.getFundraisingById();

    return data;
  }

  async getFundraisingByUserId() {
    const data = await this.models.fundraising.getFundraisingByUserId();

    return data;
  }
}
