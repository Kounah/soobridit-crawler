const Media = require('./media.class');
const WebRequest = require('kouna-lib/web/web-request.class');

/**
 * creates media from markdown string
 * @function
 * @param {string} content
 * @returns {Media}
 */
function markdown (content) {
  return new Media({
    charset: 'utf-8',
    data: Buffer.from(content, 'utf-8'),
    length: content.length,
    type: 'text/markdown'
  });
}

/**
 * creates media from a link
 * @function
 * @param {string|import('url').URL} url 
 * @returns {Promise.<Media>}
 */
async function link (url) {
  let req = new WebRequest(url, {
    encoding: 'utf-8',
    headers: {
      'Accepts': '*/*'
    },
    method: 'GET',
  });
  let res = await req.open({
    encoding: 'utf-8',
    storeResponse: true
  });
  await res.complete;
  return new Media({
    charset: res.encoding,
    type: res.type,
    data: Buffer.from(res.content),
    length: res.content.length,
    name: res.name(),
    url: require('url').format(res.request.url())
  });
}

/**
 * @typedef {Object} MediaIndex
 * @prop {import('./media.class')} Media
 * @prop {markdown} markdown
 * @prop {link} link
 */

/**@type {MediaIndex} */
module.exports = {
  markdown,
  link,
  Media
}