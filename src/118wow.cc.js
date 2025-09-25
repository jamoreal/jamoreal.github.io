const BaseScraper = require('./baseScraper')

class Wow118Scraper extends BaseScraper {
  constructor() {
    super({
      rootLink: 'https://www.118wow.cc/',
      jsonLink: './data/118wow.json',
      pageUrlTemplate: (page) => `https://www.118wow.cc/forum-2-${page}.html`
    })
  }
}

async function bootstrap() {
  const scraper = new Wow118Scraper()
  await scraper.start()
}

module.exports = {
  bootstrap
}
