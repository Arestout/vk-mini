// Core
import dg from 'debug';

//Instruments
import cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';
// import devices from 'puppeteer/DeviceDescriptors';
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
    return new Promise((resolve, reject) => {
      axios
        .get('https://dobro.mail.ru/projects/rss/target/')
        .then(response => xml2js.parseStringPromise(response.data))
        .then(result => {
          this.parsedRssProjects = result.torg_price.shop[0].offers[0].offer;
          resolve(this.parsedRssProjects);
        })
        .catch(error => debug(error));
    });
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
        elements => elements[elements.length - 1].innerText
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
              const projectLead = $(element)
                .find('.p-project__lead > strong')
                .remove()
                .end()
                .find('.p-project__lead')
                .text()
                .trim();

              const parsedRssProject = this.parsedRssProjects.find(
                item => item.typePrefix.join(' ') === projectLead
              );

              const id = parsedRssProject.$.id;
              const projectLink = parsedRssProject.url.join('');

              const imagePath = $(element)
                .find('.photo__pic')
                .css('background-image');

              const projectName = $(element)
                .find('.p-project__name.link-holder')
                .text();

              const city = $(element)
                .find('.p-project__info-city.link-holder_over')
                .text();

              const projectMoney = $(element)
                .find('.p-money__money')
                .first()
                .text();

              const projectMoneyGoal = $(element)
                .find('.p-money__money.p-money__money_goal')
                .text();

              const progressBar = $(element)
                .find('.p-progressbar__bar.p-progressbar__bar_front')
                .css('width');

              this.projects[index] = {
                id,
                imagePath,
                city,
                projectName,
                projectLink,
                projectLead,
                projectMoney,
                projectMoneyGoal,
                progressBar,
              };
            }
          );
          resolve({
            pages: this.pagesCount,
            projects: this.projects,
          });
        })
        .catch(error => {
          debug(error.message);
        });
    });
  }

  async getProjectData(path) {
    const projectData = {};
    const url = `https://dobro.mail.ru/projects${path}`;

    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(response => {
          const $ = cheerio.load(response.data, {
            decodeEntities: false,
          });

          projectData.cityLink = $('.link.color_gray.breadcrumbs__link').attr(
            'href'
          );
          projectData.city = $(
            '.link.color_gray.breadcrumbs__link > .link__text'
          ).text();
          projectData.imagePath = $('.photo__pic').css('background-image');
          projectData.money = $(
            '.cell.valign_middle > .p-money.p-money_bold > .p-money__money'
          )
            .first()
            .text();
          projectData.moneyGoal = $('.p-money__money.p-money__money_goal')
            .first()
            .text();
          projectData.shortDescription = $('.p-project__lead').text();
          projectData.text = $('.article__text').html();

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
              const cityName = $(element).text();
              const cityTitle = $(element).attr('value');

              cities[index] = {
                id: index,
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
