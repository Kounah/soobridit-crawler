const klib = require('kouna-lib');
/**@type {import('kouna-lib/functions/async-queue').AsyncQueueFunction} */
const asyncQueue = klib.fn.asyncQueue;
const TurndownService = require('turndown')
const media = require('../media');
const puppeteer = require('puppeteer');
const url = require('url');

let turndown = new TurndownService();

/**@typedef {import('../mongo/schemas/comment').Comment} Comment*/

/**
 * @param {Comment} comment
 * @returns {Promise.<Comment>}
*/
async function inflateMedia(comment) {
  if(typeof comment !== 'object' || comment === null)
    throw new TypeError('comment is not an object');

  if(typeof comment.$media === 'string') {
    let m;
    switch(comment.type) {
    case 'comment':
      m = media.markdown(turndown.turndown(comment.$media));
      break;
    case 'link':
      m = await media.link(comment.$media);
      break;
    }
    comment.media = m;
    delete comment.$media;
  }

  comment.children = await asyncQueue(comment.children, async item => {
    return await inflateMedia(item);
  });

  return comment;
}


function postEvalFunction() {
  /**
   * @prop {HTMLDivElement} thing
   */
  function grabData(thing) {
    if (typeof thing !== 'object' || thing === null)
      throw new Error('thing must be an object');

    let data = {
      fullname: thing.getAttribute('data-fullname'),
      type: thing.getAttribute('data-type'),
      gildings: thing.getAttribute('data-gilding'),
      whiteListStatus: thing.hasAttribute('data-whitelist-status'),
      author: thing.getAttribute('data-author'),
      authorFullname: thing.getAttribute('data-author-fullname'),
      subreddit: thing.getAttribute('data-subreddit'),
      subredditPrefixed: thing.getAttribute('data-subreddit-prefixed'),
      subredditFullname: thing.getAttribute('data-subreddit-fullname'),
      subredditType: thing.getAttribute('data-subreddit-type'),
      timestamp: thing.getAttribute('data-timestamp'),
      url: thing.getAttribute('data-url'),
      permalink: thing.getAttribute('data-permalink'),
      domain: thing.getAttribute('data-domain'),
      rank: thing.getAttribute('data-rank'),
      commentsCount: thing.getAttribute('data-comments-count'),
      score: thing.getAttribute('data-score'),
      promoted: thing.getAttribute('data-promoted'),
      nsfw: thing.getAttribute('data-nsfw'),
      spoiler: thing.getAttribute('data-spoiler'),
      oc: thing.getAttribute('data-oc'),
      numCrossposts: thing.getAttribute('data-num-crossposts'),
      context: thing.getAttribute('data-context'),
    }

    return data;
  }

  /**
   * 
   * @param {HTMLDivElement} thing 
   * @returns {Comment}
   */
  function grabPost(thing) {
    let data = grabData(thing);
    let m = grabMedia(data, thing);
    /**@type {Comment} */
    let c = {
      title: thing.querySelector('.entry .title').textContent,
      $parent: undefined,
      children: undefined,
      author: {
        name: data.author,
        fullname: data.authorFullname
      },
      fullname: data.fullname,
      $media: m,
      soobridit: {
        type: data.subredditType,
        name: data.subreddit,
        fullname: data.subredditFullname
      },
      score: Number(data.score),
      url: data.url,
      timestamp: Number(data.timestamp),
      type: data.type
    };
    return c;
  }

  function grabMedia(data, thing) {
    let m;
    switch (data.type) {
      case 'comment':
        m = thing.querySelector('.usertext-body .md').innerHTML;
        break;
      case 'link':
        m = thing.querySelector('a.thumbnail').getAttribute('href');
        break;
    }
    return m;
  }

  /**
   * @param {HTMLDivElement} thing,
   * @returns {Promise.<Comment>}
   */
  function grabComment(thing) {
    if(typeof thing !== 'object' || thing === null)
      return undefined;
    
    let data = grabData(thing);

    let children = grabComments(thing.querySelector('.child>.sitetable'));
    return {
      score: Number(data.score),
      timestamp: Number(data.timestamp),
      type: data.type,
      author: {
        name: data.author,
        fullname: data.authorFullname
      },
      $media: grabMedia(data, thing),
      children
    }
  }

  /**
   * @param {HTMLDivElement} sitetable
   * @returns {Promise.<Array.<Comment>>}
   */
  function grabComments(sitetable) {
    if(typeof sitetable !== 'object' || sitetable === null)
      return [];

    /**@type {Array.<HTMLElement>} */
    let things = Array.prototype.slice.call(sitetable.children);
    things = things
      .filter(el => el.classList.contains('thing'));
    
    return things.map(item => grabComment(item));
  }

  let post = grabPost(document.querySelector('.content>.sitetable>.thing'));
  let comments = grabComments(document.querySelector('.content>.commentarea>.sitetable'))
  post.children = comments;
  return post;
}

/**
 * @this {import('./crawler.class')}
 */
async function crawl() {
  let t = this;
  let addr = this.url;
  let done = false;

  let browser = await puppeteer.launch(t.config.browser);
  do {
    let page = await browser.newPage();
    page.goto(addr);

    let content = await new Promise(resolve => {
      page.on('load', () => {
        page.evaluate(() => {
          /**@type {Array.<HTMLDivElement>} */
          let things = Array.prototype.slice.call(document.querySelectorAll('.sitetable.linklisting .thing'));
          let posts = things.map(thing => thing.getAttribute('data-permalink'));
          
          /**@type {HTMLAnchorElement} */
          let next = document
            .querySelector('#siteTable > div.nav-buttons > span > span.next-button > a')
            .getAttribute('href');

          return {
            posts,
            next
          }
        }).then(value => resolve(value));
      });
    });

    content.posts = await asyncQueue(content.posts, async (postPath) => {
      let _page = await browser.newPage();
      let theUrlToGoTo = url.format({
        slashes: true,
        protocol: t.config.protocol,
        host: t.config.host,
        pathname: postPath
      });
      console.log('='.repeat(theUrlToGoTo.length) + 
        '\n' + 
        theUrlToGoTo + 
        '\n' + 
        '='.repeat(theUrlToGoTo.length));

      _page.goto(theUrlToGoTo);
      _page.on('console', (e) => {
        let text = e.text();

        if(text.startsWith('[puppeteer-hook] ')) {
          console.log(text);
        }
      })

      let details = await new Promise((resolve, reject) => {
        _page.on('load', () => {
          _page.evaluate(postEvalFunction)
            .then(value => { resolve(value); _page.close(); })
            .catch(reason => { reject(reason); _page.close(); })
        });
      });

      details = await inflateMedia(details);
      console.log(details);
      return details;
    }, {
      delay: t.config.delay,
      errorHandler: (err) => {
        console.error(err);
      }
    });
    
    if(typeof content.next === 'string')
      addr = content.next;
    else done = true;
    page.close();
  } while(!done);
}

module.exports = crawl;