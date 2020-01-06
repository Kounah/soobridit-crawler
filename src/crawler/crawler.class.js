const mongoose = require('mongoose');

const klib = require('kouna-lib');
const url = require('url');
const path = require('path');
const Mongo = require('../mongo/mongo.class');
const CrawlerConfig = require('./crawler-config.class');

const puppeteer = require('puppeteer');

class Crawler {
  /**
   * 
   * @param {import('./crawler-config.class').Class} config 
   */
  constructor(config) {
    if(typeof config !== 'object'
    || config === null)
      config = new CrawlerConfig(config);

    /**@type {import('./crawler-config.class').Class} */
    this.config = config;

    this.url = url.format({
      host: this.config.host,
      protocol: this.config.protocol,
      slashes: true,
      pathname: `/r/${this.config.soobridit}/${this.config.soobriditCategory}`
    });

    this.db = new Mongo(this.config.mongo);
  }

  async crawl() {
    let addr = this.url;
    let done = false;
    let browser = await puppeteer.connect();
    do {
      let page = await browser.newPage(addr);
      page.on('load', () => {
        let posts = await page.evaluate(function() {
          /**@type {Array.<HTMLDivElement>} */
          let things = Array.prototype.slice.call(document.querySelectorAll('.thing'));
          things = things.filter(el => typeof el.id === 'string' && el.id !== '');
          return things.map(thing => {
            return {
              fullname          : thing.getAttribute('data-fullname'),
              type              : thing.getAttribute('data-type'),
              gildings          : thing.getAttribute('data-gilding'),
              whiteListStatus   : thing.hasAttribute('data-whitelist-status'),
              author            : thing.getAttribute('data-author'),
              authorFullname    : thing.getAttribute('data-author-fullname'),
              subreddit         : thing.getAttribute('data-subreddit'),
              subredditPrefixed : thing.getAttribute('data-subreddit-prefixed'),
              subredditFullname : thing.getAttribute('data-subreddit-fullname'),
              subredditType     : thing.getAttribute('data-subreddit-type'),
              timestamp         : thing.getAttribute('data-timestamp'),
              url               : thing.getAttribute('data-url'),
              permalink         : thing.getAttribute('data-permalink'),
              domain            : thing.getAttribute('data-domain'),
              rank              : thing.getAttribute('data-rank'),
              commentsCount     : thing.getAttribute('data-comments-count'),
              score             : thing.getAttribute('data-score'),
              promoted          : thing.getAttribute('data-promoted'),
              nsfw              : thing.getAttribute('data-nsfw'),
              spoiler           : thing.getAttribute('data-spoiler'),
              oc                : thing.getAttribute('data-oc'),
              numCrossposts     : thing.getAttribute('data-num-crossposts'),
              context           : thing.getAttribute('data-context')
            };
          });
        });

        await klib.fn.asyncQueue(posts, async (post) => {
          
        });
      });
    } while(!done);
  }
}

module.exports = Crawler;