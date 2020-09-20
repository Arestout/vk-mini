// Instruments
import {
  Projects as ProjectsModel,
  Projects as DbProjectsModel,
  Donations as DonationsModel,
} from '../models';

export class Donations {
  constructor(data) {
    this.models = {
      projects: new ProjectsModel(),
      dbProjects: new DbProjectsModel(),
      donations: new DonationsModel(data),
    };
  }

  async create() {
    const data = await this.models.donations.create();

    return data;
  }

  async getDonationsById() {
    const data = await this.models.donations.getDonationsById();

    return data;
  }
}
