// Instruments
import { Projects as ProjectsModel } from '../models';

export class Projects {
  constructor() {
    this.models = {
      projects: new ProjectsModel(),
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
}
