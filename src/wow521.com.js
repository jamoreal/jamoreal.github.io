const BaseScraper = require('./baseScraper')

class Wow521Scraper extends BaseScraper {
  constructor() {
    super({
      rootLink: 'https://www.wow521.com/',
      jsonLink: './data/wow521.json',
      pageUrlTemplate: (page) => `https://www.wow521.com/forum-2-${page}.html`
    })
  }
}

async function bootstrap() {
  const scraper = new Wow521Scraper()
  await scraper.start()
}

module.exports = {
  bootstrap
}
