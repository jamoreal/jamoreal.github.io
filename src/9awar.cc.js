const BaseScraper = require('./baseScraper')

class AwarScraper extends BaseScraper {
  constructor() {
    super({
      rootLink: 'https://www.9awar.cc/',
      jsonLink: './data/9awar.json',
      pageUrlTemplate: (page) => `https://www.9awar.cc/forum-2-${page}.html`
    })
  }
}

async function bootstrap() {
  const scraper = new AwarScraper()
  await scraper.start()
}

module.exports = {
  bootstrap
}
