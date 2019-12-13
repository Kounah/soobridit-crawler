const mongoose = require('mongoose');

const Mongo = require('../mongo/mongo.class');
const CrawlerConfig = require('./crawler-config.class');

class Crawler {
  /**
   * 
   * @param {import('./crawler-config.class').Class} config 
   */
  constructor(config) {
    if(typeof config !== 'object'
    || config === null)
      config = new CrawlerConfig(config);

    this.db = new Mongo(this.config.mongo);
  }
}

module.exports = Crawler;