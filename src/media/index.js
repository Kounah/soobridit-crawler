const Media = require('./media.class');

/**
 * creates media from markdown string
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
 * @param {*} url 
 */
function link (url) {
  // TODO: write request (write one for files in the lib first)
}