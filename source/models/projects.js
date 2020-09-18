// Core
import dg from 'debug';

//Instruments
import cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';
import xml2js from 'xml2js';
import queryString from 'query-string';

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
    await puppeteer.launch({ headless: true }).then(async browser => {
      const page = await browser.newPage();
      await page.emulate(iPhoneX);
      await page.goto(url);
      const pagesMobileVersion = await page.$$eval(
        SELECTOR,
        elements => elements[elements.length - 1]?.innerText
      );
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

              const id = parsedRssProject.$.id;
              const path = parsedRssProject.model.join('');

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
    const projectData = {};
    const url = `https://dobro.mail.ru/projects${path}`;
    await this.getRssProjects();

    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(response => {
          const $ = cheerio.load(response.data, {
            decodeEntities: false,
          });

          const imageLabel = $('.badge__text').text();
          const image = $('.photo__pic')
            .css('background-image')
            .replace(/(url\(|\))/g, '');

          const parsedRssProject = this.parsedRssProjects.find(
            item =>
              item.url.join(' ') === `https://dobro.mail.ru/projects${path}`
          );

          const id = parsedRssProject.$.id;

          projectData.id = id;
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
          projectData.html = $('.article__text').html();

          resolve(projectData);
        })
        .catch(error => debug(error));
    });
  }

  async getCities() {
    const cities = [];
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

              cities[index - 1] = {
                id: index - 1,
                name: cityName,
                title: cityTitle,
              };
            }
          );
          resolve(cities);
        })
        .catch(error => debug(error));
    });
  }
}
