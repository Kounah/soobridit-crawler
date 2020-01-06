const mongoose = require('mongoose');

const klib = require('kouna-lib');
/**@type {import('kouna-lib/fn/async-queue').AsyncQueueFunction} */
const asyncQueue = klib.fn.asyncQueue;
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
    let t = this;
    let addr = this.url;
    let done = false;

    let browser = await puppeteer.launch(t.config.browser);
    do {
      let page = await browser.newPage();
      page.goto(addr);
      let content = await new Promise(resolve => {
        page.on('load', () => {
          page.evaluate(function() {
            /**@type {Array.<HTMLDivElement>} */
            let things = Array.prototype.slice.call(document.querySelectorAll('.thing'));
            things = things.filter(el => typeof el.id === 'string' && el.id !== '')
              .map(thing => ({
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
              }));
            
            /**@type {HTMLAnchorElement} */
            let next = document
              .querySelector('#siteTable > div.nav-buttons > span > span.next-button > a')
              .getAttribute('href');

            return {
              posts: things,
              next
            }
          }).then(value => resolve(value));
        });
      });

      await asyncQueue(content.posts, async (post) => {
        let _page = await browser.newPage();
        _page.goto(url.format({
          slashes: true,
          protocol: t.config.protocol,
          host: t.config.host,
          pathname: post.permalink
        }));

        let details = await new Promise((resolve, reject) => {
          _page.on('load', () => {
            _page.evaluate(() => {
              // TODO: add crawler code for post detail page here
            }).then(value => { resolve(value); _page.close(); })
              .catch(reason => { reject(reason); _page.close(); })
          });
        });

        return details;
      }, {
        delay: t.config.delay
      });
      
      if(typeof content.next === 'string')
        addr = content.next;
      else done = true;
      page.close();
    } while(!done);
  }
}

module.exports = Crawler;