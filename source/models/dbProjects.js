// Core
import dg from 'debug';
import cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';
import xml2js from 'xml2js';

//Instruments
import { projects } from '../odm';

const debug = dg('models:dbProjects');

export class DbProjects {
  constructor() {
    this.projects = [];
    this.parsedRssProjects = [];
  }

  async getRssProjects() {
    try {
      const response = await axios.get(
        'https://dobro.mail.ru/projects/rss/target/'
      );
      const xmlResult = await xml2js.parseStringPromise(response.data);
      this.parsedRssProjects = xmlResult.torg_price.shop[0].offers[0].offer;
    } catch (error) {
      debug(error);
    }
  }

  async isElementVisible(page, cssSelector) {
    let visible = true;
    await page
      .waitForSelector(cssSelector, { visible: true, timeout: 2000 })
      .catch(() => {
        visible = false;
      });
    return visible;
  }

  extractItems() {
    const extractedElements = document.querySelectorAll(
      '.p-projects__item.p-projects__item_default'
    );
    const items = [];
    for (let element of extractedElements) {
      items.push(element.innerHTML);
    }
    return items;
  }

  async getParsedProjects(page, delay = 2000) {
    let items = [];
    try {
      let loadMoreVisible = await this.isElementVisible(
        page,
        'button[data-mp-el="Projects.more"]'
      );
      while (loadMoreVisible) {
        await page.click('button[data-mp-el="Projects.more"]').catch(() => {});
        await page.waitFor(delay);
        loadMoreVisible = await this.isElementVisible(
          page,
          'button[data-mp-el="Projects.more"]'
        );
      }
      items = await page.evaluate(this.extractItems);
    } catch (error) {
      debug(error);
    }

    return items;
  }

  async addAllProjects() {
    // await projects.deleteMany({});

    try {
      const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      await page.goto(
        'https://dobro.mail.ru/projects/?recipient=all&aid=all&city=any'
      );

      await this.getRssProjects();
      const items = await this.getParsedProjects(page, 2500);

      items.forEach(async item => {
        try {
          const $ = cheerio.load(item);
          const description = $('.p-project__lead')
            .find('strong')
            .remove()
            .end()
            .text()
            .trim();

          const parsedRssProject = this.parsedRssProjects.find(
            item => item.typePrefix.join(' ') === description
          );

          let projectId = null;
          let path = null;
          if (parsedRssProject) {
            projectId = parsedRssProject.$.id;
            path = parsedRssProject.model.join('');
          }

          const image = $('.photo__pic')
            .css('background-image')
            .replace(/(url\(|\))/g, '');

          const title = $('.p-project__name.link-holder').text();

          const city = $('.p-project__info-city.link-holder_over').text();

          const target = $('.p-money__money.p-money__money_goal')
            .text()
            .replace('р.', '')
            .trim()
            .split(' ')
            .join('');

          const project = {
            projectId,
            image: `https://dobro.mail.ru${image}`,
            city,
            title,
            path,
            description,
            target: Number(target),
            createdAt: Date.now(),
          };

          if (project.projectId) {
            (async () => {
              try {
                const query = { id: project.projectId };
                const options = { upsert: true, new: true };

                await projects.findOneAndUpdate(query, project, options);
              } catch (e) {
                debug(e.message);
              }
            })();
          }
        } catch (err) {
          console.log(err.message);
        }
      });

      await browser.close();

      return 'done';
    } catch (error) {
      console.log(error.message);
      return error;
    }
  }
}
