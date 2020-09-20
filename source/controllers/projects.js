// Instruments
import {
  Projects as ProjectsModel,
  Projects as DbProjectsModel,
} from '../models';

export class Projects {
  constructor() {
    this.models = {
      projects: new ProjectsModel(),
      dbProjects: new DbProjectsModel(),
    };
  }

  async getAll(query) {
    const data = await this.models.projects.getParsedProjects(query);

    return data;
  }

  async getProjectData(path) {
    const data = await this.models.projects.getProjectData(path);

    return data;
  }

  async getCities() {
    const data = await this.models.projects.getCities();

    return data;
  }

  async addToDb() {
    const data = await this.models.dbProjects.addAllProjects();

    return data;
  }
}
