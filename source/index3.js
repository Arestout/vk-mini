// Core
import debug from 'debug';
import cheerio from 'cheerio';
import axios from 'axios';
import xml2js from 'xml2js';
import puppeteer from 'puppeteer';

// Instruments
import { app } from './server';
import { getPort } from './utils';

const PORT = getPort();
const dg = debug('server:main');

app.listen(PORT, () => {
  dg(`Server API is running on port ${PORT}`);
});

let parsedRssProjects = [];
const data = [];
const URL = 'https://dobro.mail.ru/projects/?recipient=kids&aid=all&city=any';

const isElementVisible = async (page, cssSelector) => {
  let visible = true;
  await page
    .waitForSelector(cssSelector, { visible: true, timeout: 2000 })
    .catch(() => {
      visible = false;
    });
  return visible;
};

function extractItems() {
  const extractedElements = document.querySelectorAll(
    '.p-projects__item.p-projects__item_default'
  );
  const items = [];
  for (let element of extractedElements) {
    items.push(element.innerHTML);
  }
  return items;
}

async function scrapeProjects(page, extractItems, delay = 2000) {
  let items = [];
  try {
    let loadMoreVisible = await isElementVisible(
      page,
      'button[data-mp-el="Projects.more"]'
    );
    while (loadMoreVisible) {
      await page.click('button[data-mp-el="Projects.more"]').catch(() => {});
      // items = await page.evaluate(extractItems.bind(null, page));
      await page.waitFor(delay);
      loadMoreVisible = await isElementVisible(
        page,
        'button[data-mp-el="Projects.more"]'
      );
    }
    items = await page.evaluate(extractItems);
  } catch (error) {}

  return items;
}

(async () => {
  // Set up browser and page.
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // Navigate to the demo page.
  await page.goto(
    'https://dobro.mail.ru/projects/?recipient=kids&aid=all&city=any'
  );

  // Scroll and extract items from the page.
  const items = await scrapeProjects(page, extractItems, 750);

  // console.log(items);
  items.forEach(item => {
    const $ = cheerio.load(item);
    const projectLead = $('.p-project__lead')
      .find('strong')
      .remove()
      .end()
      .text()
      .trim();
    console.log(projectLead);
  });

  // Close the browser.
  await browser.close();
})();

// axios.get('https://dobro.mail.ru/projects/rss/target/').then(response => {
//   xml2js.parseString(response.data, (err, result) => {
//     if (err) {
//       throw err;
//     }
//     parsedRssProjects = result.torg_price.shop[0].offers[0].offer;
//     // console.log(parsedRssProjects);
//   });
// });

// axios
//   .get(URL)
//   .then(response => {
//     let $ = cheerio.load(response.data);
//     $('.p-projects__item.p-projects__item_default').each(function(
//       index,
//       element
//     ) {
//       const projectLead = $(element)
//         .find('.p-project__lead > strong')
//         .remove()
//         .end()
//         .find('.p-project__lead')
//         .text()
//         .trim();

//       const parsedRssProject = parsedRssProjects.find(
//         item => item.typePrefix.join(' ') === projectLead
//       );

//       console.log(parsedRssProject);

//       const id = parsedRssProject.$.id;
//       const imagePath = parsedRssProject.picture.join('');
//       const projectLink = parsedRssProject.url.join('');

//       const projectName = $(element)
//         .find('.p-project__name.link-holder')
//         .text();

//       const city = $(element)
//         .find('.p-project__info-city.link-holder_over')
//         .text();

//       const projectMoney = $(element)
//         .find('.p-money__money')
//         .first()
//         .text();

//       const projectMoneyGoal = $(element)
//         .find('.p-money__money.p-money__money_goal')
//         .text();

//       const progressBar = $(element)
//         .find('.p-progressbar__bar.p-progressbar__bar_front')
//         .css('width');

//       data[index] = {
//         id,
//         imagePath,
//         city,
//         projectName,
//         projectLink,
//         projectLead,
//         projectMoney,
//         projectMoneyGoal,
//         progressBar,
//       };
//     });
//   })
//   .catch(function(e) {
//     console.log(e);
//   });

// (async () => {
//   try {
//     const response = await axios.get(
//       'https://dobro.mail.ru/projects/rss/target/'
//     );
//     xml2js.parseString(response.data, (err, result) => {
//       if (err) {
//         throw err;
//       }
//       parsedRssProjects = result.torg_price.shop[0].offers[0].offer;
//       // console.log(parsedRssProjects);
//     });
//   } catch (error) {
//     console.log('xml', error.message);
//   }
// })();

// const isElementVisible = async (page, cssSelector) => {
//   let visible = true;
//   await page
//     .waitForSelector(cssSelector, { visible: true, timeout: 2000 })
//     .catch(() => {
//       visible = false;
//     });
//   return visible;
// };

// (async () => {
//   try {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(
//       'https://dobro.mail.ru/projects/?recipient=kids&aid=all&city=any',
//       { waitUntil: 'networkidle2' }
//     );

//     let loadMoreVisible = await isElementVisible(
//       page,
//       'button[data-mp-el="Projects.more"]'
//     );
//     while (loadMoreVisible) {
//       await page.click('button[data-mp-el="Projects.more"]').catch(() => {});
//       loadMoreVisible = await isElementVisible(
//         page,
//         'button[data-mp-el="Projects.more"]'
//       );
//     }

//     // await page.click('button[data-mp-el="Projects.more"]');

//     // await page.evaluate(async () => {
//     //   document.querySelector('button[data-mp-el="Projects.more"]').click();
//     // });

//     // let element = await page.$('[data-mp-el="Projects.more"]');
//     // await element.click();
//     // while (element) {
//     //   await element.click();
//     //   element = await page.$('[data-mp-el="Projects.more"]');
//     // }

//     const content = await page.content();
//     const $ = cheerio.load(content);

//     $('.p-projects__item.p-projects__item_default').each((index, element) => {
//       const projectLead = $(element)
//         .find('.p-project__lead > strong')
//         .remove()
//         .end()
//         .find('.p-project__lead')
//         .text()
//         .trim();

//       const parsedRssProject = parsedRssProjects.find(
//         item => item.typePrefix.join(' ') === projectLead
//       );

//       console.log(parsedRssProject);

//       const id = parsedRssProject.$.id;
//       const imagePath = parsedRssProject.picture.join('');
//       const projectLink = parsedRssProject.url.join('');

//       const projectName = $(element)
//         .find('.p-project__name.link-holder')
//         .text();

//       const city = $(element)
//         .find('.p-project__info-city.link-holder_over')
//         .text();

//       const projectMoney = $(element)
//         .find('.p-money__money')
//         .first()
//         .text();

//       const projectMoneyGoal = $(element)
//         .find('.p-money__money.p-money__money_goal')
//         .text();

//       const progressBar = $(element)
//         .find('.p-progressbar__bar.p-progressbar__bar_front')
//         .css('width');

//       data[index] = {
//         id,
//         imagePath,
//         city,
//         projectName,
//         projectLink,
//         projectLead,
//         projectMoney,
//         projectMoneyGoal,
//         progressBar,
//       };
//     });
//     console.log(data.length);
//     await browser.close();
//   } catch (error) {
//     console.log(error.message);
//   }
// })();

// app.use('/', function(req, res) {
//   res.json(data[0]);
// });
