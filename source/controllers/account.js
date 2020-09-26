// Instruments
import {
  Achievements as AchievementsModel,
  Donations as DonationsModel,
  Users as UsersModel,
  Fundraising as FundraisingModel,
} from '../models';

export class Account {
  constructor(data) {
    this.models = {
      achievements: new AchievementsModel(data),
      donations: new DonationsModel(data),
      users: new UsersModel(data),
      fundraising: new FundraisingModel(data),
    };
  }

  async createUser() {
    await this.models.users.create();
  }

  async create() {
    const doesUserExist = await this.models.users.exists();

    if (!doesUserExist) {
      await this.createUser();
    }

    const data = await this.models.donations.create();

    return data;
  }

  async getDonationsById() {
    const data = await this.models.donations.getDonationsById();

    return data;
  }

  async getPointsById() {
    const data = await this.models.achievements.getPointsById();

    return data;
  }

  async postWallPoints() {
    const doesUserExist = await this.models.users.exists();

    if (!doesUserExist) {
      await this.createUser();
    }

    const data = await this.models.achievements.postWallPoints();

    return data;
  }

  async postStoriesPoints() {
    const doesUserExist = await this.models.users.exists();

    if (!doesUserExist) {
      await this.createUser();
    }

    const data = await this.models.achievements.postStoriesPoints();

    return data;
  }

  async createFundraising() {
    const doesUserExist = await this.models.users.exists();

    if (!doesUserExist) {
      await this.createUser();
    }

    const data = await this.models.fundraising.create();

    return data;
  }

  async getFundraisingByUserId() {
    const data = await this.models.fundraising.getFundraisingByUserId();

    return data;
  }
}
