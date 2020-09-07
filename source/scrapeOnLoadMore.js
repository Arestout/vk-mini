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
