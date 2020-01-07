const mongoose = require('mongoose');

const url = require('url');
const path = require('path');
const Mongo = require('../mongo/mongo.class');
const CrawlerConfig = require('./crawler-config.class');
const crawlOld = require('./crawl-old');

const puppeteer = require('puppeteer');

class Crawler {
  /**
   * 
   * @param {import('./crawler-config.class').Class} config 
   */
  constructor(config) {
    /**@type {import('./crawler-config.class').Class} */
    this.config = new CrawlerConfig(config);

    this.url = url.format({
      host: this.config.host,
      protocol: this.config.protocol,
      slashes: true,
      pathname: `r/${this.config.soobridit}/${this.config.category}`
    });

    this.db = new Mongo(this.config.mongo);
  }

  async crawl() {
    switch(this.config.type) {
      case 'old':
        return await crawlOld.call(this);
      case 'current':
        throw new Error('Not Implemented');
      case 'api':
        throw new Error('Not Implemented');
      default:
        throw new Error('unknown type');
    }
  }
}

module.exports = Crawler;