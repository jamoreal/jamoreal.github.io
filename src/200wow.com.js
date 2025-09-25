const BaseScraper = require('./baseScraper')

class Wow200Scraper extends BaseScraper {
  constructor() {
    super({
      rootLink: 'https://www.200wow.com/',
      jsonLink: './data/200wow.json',
      pageUrlTemplate: (page) => `https://www.200wow.com/forum-2-${page}.html`
    })
  }
}

async function bootstrap() {
  const scraper = new Wow200Scraper()
  await scraper.start()
}

module.exports = {
  bootstrap
}
