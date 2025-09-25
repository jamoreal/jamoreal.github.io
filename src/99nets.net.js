const BaseScraper = require('./baseScraper')

class NetsScraper extends BaseScraper {
  constructor() {
    super({
      rootLink: 'http://www.99nets.net/',
      jsonLink: './data/99nets.json',
      pageUrlTemplate: (page) => `http://www.99nets.net/forum-36-${page}.html`
    })
  }
}

async function bootstrap() {
  const scraper = new NetsScraper()
  await scraper.start()
}

module.exports = {
  bootstrap
}
