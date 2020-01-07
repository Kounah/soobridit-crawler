const klib = require('kouna-lib');
/**@type {import('kouna-lib/fn/async-queue').AsyncQueueFunction} */
const asyncQueue = klib.fn.asyncQueue;
const TurndownService = require('turndown')

let turndown = new TurndownService();

/**
 * @prop {HTMLDivElement} thing
 */
function grab(thing) {
  if(typeof thing !== 'object' || thing === null)
    return undefined;

  let data = {
    fullname:           thing.getAttribute('data-fullname'),
    type:               thing.getAttribute('data-type'),
    gildings:           thing.getAttribute('data-gilding'),
    whiteListStatus:    thing.hasAttribute('data-whitelist-status'),
    author:             thing.getAttribute('data-author'),
    authorFullname:     thing.getAttribute('data-author-fullname'),
    subreddit:          thing.getAttribute('data-subreddit'),
    subredditPrefixed:  thing.getAttribute('data-subreddit-prefixed'),
    subredditFullname:  thing.getAttribute('data-subreddit-fullname'),
    subredditType:      thing.getAttribute('data-subreddit-type'),
    timestamp:          thing.getAttribute('data-timestamp'),
    url:                thing.getAttribute('data-url'),
    permalink:          thing.getAttribute('data-permalink'),
    domain:             thing.getAttribute('data-domain'),
    rank:               thing.getAttribute('data-rank'),
    commentsCount:      thing.getAttribute('data-comments-count'),
    score:              thing.getAttribute('data-score'),
    promoted:           thing.getAttribute('data-promoted'),
    nsfw:               thing.getAttribute('data-nsfw'),
    spoiler:            thing.getAttribute('data-spoiler'),
    oc:                 thing.getAttribute('data-oc'),
    numCrossposts:      thing.getAttribute('data-num-crossposts'),
    context:            thing.getAttribute('data-context'),
  }

  let media
  switch(data.type) {
    case 'comment':
      media = media.markdown(turndown.turndown(thing.querySelector('.usertext-body .md').innerHTML));
    case 'link':
      media = media.link(thing.querySelector('a.thumbnail').getAttribute('href'));
  }


  let children = Array.prototype.slice.call(thing.querySelectorAll('.child>.sitetable>.thing'));
  return {
    data,
    content,
    children: children.map(child => grab(child))
  }
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
        page.evaluate(function() {
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

    await asyncQueue(content.posts, async (postPath) => {
      let _page = await browser.newPage();
      _page.goto(url.format({
        slashes: true,
        protocol: t.config.protocol,
        host: t.config.host,
        pathname: postPath
      }));

      let details = await new Promise((resolve, reject) => {
        _page.on('load', () => {
          _page.evaluate(() => {
            // TODO: add crawler code for post detail page here

            /**@type {Array.<HTMLDivElement>} */
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

module.exports = crawl;