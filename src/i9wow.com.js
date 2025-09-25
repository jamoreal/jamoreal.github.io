const BaseScraper = require('./baseScraper')

class I9WowScraper extends BaseScraper {
  constructor() {
    super({
      rootLink: 'http://i9wow.com/',
      jsonLink: './data/i9wow.json',
      pageUrlTemplate: (page) => `http://i9wow.com/forum-2-${page}.html`
    })
  }
}

async function bootstrap() {
  const scraper = new I9WowScraper()
  await scraper.start()
}

module.exports = {
  bootstrap
}
