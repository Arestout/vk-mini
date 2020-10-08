// Core
import dg from 'debug';

//Instruments
import cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';
import xml2js from 'xml2js';
import queryString from 'query-string';

import { projects } from '../odm';

const debug = dg('models:projects');
const iPhoneX = puppeteer.devices['iPhone X'];

export class Projects {
  constructor() {
    this.projects = [];
    this.parsedRssProjects = [];
    this.pagesCount = 0;
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

  async getPagesCount(url) {
    const SELECTOR = '.m-pager__inner';
    const projectsCountDesktop = 12;
    const projectsCountMobile = 5;
    await puppeteer
      .launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
      })
      .then(async browser => {
        const page = await browser.newPage();
        await page.emulate(iPhoneX);
        await page.goto(url);
        const pagesMobileVersion = await page.$$eval(SELECTOR, elements => {
          if (elements[elements.length - 1]) {
            return elements[elements.length - 1].innerText;
          }
        });
        if (pagesMobileVersion && pagesMobileVersion > 2) {
          this.pagesCount = Math.ceil(
            (pagesMobileVersion * projectsCountMobile) / projectsCountDesktop
          );
        }
        await browser.close();
      });
    return this.pagesCount;
  }

  async getParsedProjects(query) {
    const stringifiedQuery = queryString.stringify(query);
    const url = `https://dobro.mail.ru/projects/?${stringifiedQuery}`;

    await Promise.all([this.getRssProjects(), this.getPagesCount(url)]);

    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(response => {
          const $ = cheerio.load(response.data);

          $('.p-projects__item.p-projects__item_default').each(
            (index, element) => {
              const description = $(element)
                .find('.p-project__lead > strong')
                .remove()
                .end()
                .find('.p-project__lead')
                .text()
                .trim();

              const parsedRssProject = this.parsedRssProjects.find(
                item => item.typePrefix.join(' ') === description
              );

              let id = null;
              let path = null;
              if (parsedRssProject) {
                id = parsedRssProject.$.id;
                path = parsedRssProject.model.join('');
              }

              const image = $(element)
                .find('.photo__pic')
                .css('background-image')
                .replace(/(url\(|\))/g, '');

              const title = $(element)
                .find('.p-project__name.link-holder')
                .text();

              const city = $(element)
                .find('.p-project__info-city.link-holder_over')
                .text();

              const sum = $(element)
                .find('.p-money__money')
                .first()
                .text()
                .replace('р.', '')
                .trim()
                .split(' ')
                .join('');

              const target = $(element)
                .find('.p-money__money.p-money__money_goal')
                .text()
                .replace('р.', '')
                .trim()
                .split(' ')
                .join('');

              const imageLabel = $(element)
                .find('.badge__text')
                .text();

              // const progressBar = $(element)
              //   .find('.p-progressbar__bar.p-progressbar__bar_front')
              //   .css('width');

              if (id) {
                this.projects[index] = {
                  id,
                  image: `https://dobro.mail.ru${image}`,
                  city,
                  title,
                  path,
                  description,
                  sum: sum !== target ? Number(sum) : 0,
                  target: Number(target),
                  urgent: imageLabel === 'срочно',
                };
              }
            }
          );
          resolve({
            pages: this.pagesCount,
            page: query.page ? Number(query.page) : 1,
            projects: this.projects,
          });
        })
        .catch(error => {
          debug(error.message);
          reject([]);
        });
    });
  }

  async getProjectData(path) {
    try {
      const projectData = {};
      const url = `https://dobro.mail.ru/projects${path}`;
      await this.getRssProjects();

      const response = await axios.get(url);
      const $ = cheerio.load(response.data, {
        decodeEntities: false,
      });

      const imageLabel = $('.badge__text').text();
      const image = $('.photo__pic')
        .css('background-image')
        .replace(/(url\(|\))/g, '');
      const title = $('.hdr__inner')
        .first()
        .text();

      const parsedRssProject = this.parsedRssProjects.find(
        item => item.url.join(' ') === `https://dobro.mail.ru/projects${path}`
      );

      let id = null;

      if (parsedRssProject) {
        id = parsedRssProject.$.id;
      }

      if (!id) {
        const project = await projects.findOne({ title });
        id = project.id;
      }

      projectData.id = id;
      projectData.path = path;
      projectData.title = title;
      projectData.description = $('.p-project__lead').text();
      projectData.cityLink = $('.link.color_gray.breadcrumbs__link')
        .attr('href')
        .replace('/projects/', '');
      projectData.city = $(
        '.link.color_gray.breadcrumbs__link > .link__text'
      ).text();
      projectData.image = `https://dobro.mail.ru${image}`;

      projectData.sum = $(
        '.cell.valign_middle > .p-money.p-money_bold > .p-money__money'
      )
        .first()
        .text()
        .replace('р.', '')
        .trim()
        .split(' ')
        .join('');
      projectData.target = $('.p-money__money.p-money__money_goal')
        .first()
        .text()
        .replace('р.', '')
        .trim()
        .split(' ')
        .join('');
      projectData.description = $('.p-project__lead').text();
      projectData.date = $('.note__text.breadcrumbs__text').text();
      projectData.urgent = imageLabel === 'срочно';

      const gallery = $(
        '.article__item.article__item_alignment_left.article__item_gallery'
      );

      if (gallery.html()) {
        projectData.gallery = $(gallery)
          .html()
          .replace(/:url\(/g, ':url(https://dobro.mail.ru');

        projectData.html = $('.article__text')
          .find(
            '.article__item.article__item_alignment_left.article__item_gallery'
          )
          .remove()
          .end()
          .html()
          .replace(/src="/g, 'src="https://dobro.mail.ru');
      } else {
        projectData.gallery = '';

        projectData.html = $('.article__text')
          .html()
          .replace(/src="/g, 'src="https://dobro.mail.ru');
      }

      if (projectData.id) {
        (async () => {
          try {
            const query = { id: projectData.id };
            const update = {
              html: projectData.html,
              gallery: projectData.gallery,
            };
            const options = { upsert: false, new: false };

            await projects.findOneAndUpdate(query, update, options);
          } catch (e) {
            debug(e.message);
          }
        })();
      }

      return projectData;
    } catch (error) {
      debug(error.message);
    }
  }

  async getCities() {
    const data = {
      stats: {},
      cities: [],
    };

    const url = `https://dobro.mail.ru/`;

    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(response => {
          const $ = cheerio.load(response.data, {
            decodeEntities: false,
          });
          $('.suggest__item.js-dropdown__suggest-item.js-ga-filter-city').each(
            (index, element) => {
              const cityTitle = $(element).text();
              const cityName = $(element).attr('value');

              data.cities[index - 1] = {
                id: index - 1,
                name: cityName,
                title: cityTitle,
              };
            }
          );
          $('.p-dobro-stats__item-count').each((index, element) => {
            const item = $(element).text();
            switch (index) {
              case 0:
                data.stats.fonds = Number(item.split(' ').join(''));
                break;
              case 1:
                data.stats.checked_projects = Number(item.split(' ').join(''));
                break;
              case 2:
                data.stats.people = Number(item.split(' ').join(''));
              case 3:
                data.stats.success_projects = Number(item.split(' ').join(''));
                break;
              default:
                break;
            }
          });

          resolve(data);
        })
        .catch(error => debug(error));
    });
  }
}
