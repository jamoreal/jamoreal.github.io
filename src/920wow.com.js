const BaseScraper = require('./baseScraper')

class Wow920Scraper extends BaseScraper {
  constructor() {
    super({
      rootLink: 'http://920wow.com/',
      jsonLink: './data/920wow.json',
      pageUrlTemplate: (page) => `http://920wow.com/forum-2-${page}.html`
    })
  }
}

async function bootstrap() {
  const scraper = new Wow920Scraper()
  await scraper.start()
}

module.exports = {
  bootstrap
}
