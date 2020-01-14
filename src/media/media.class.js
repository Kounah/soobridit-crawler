const klib = require('kouna-lib');
const defined = klib.fn.defined;
const extend = klib.fn.extend;
const mime = require('mime');
const crypto = require('crypto');

/**@type {Media} */
const def = {
  data: new Buffer.from('', 'utf-8'),
  type: 'text/plain',
  charset: 'utf-8',
}

/**@typedef {Media} Class*/
class Media {
  /**
   * 
   * @param {Media} props
   */
  constructor(props) {
    /**@type {Buffer} */
    this.data = defined(props.data, def.data);
    /**
     * mime type
     * @type {string} */
    this.type = defined(props.type, def.type);
    /**
     * buffer length
     * @type {number} */
    this.length = defined(props.length, def.length);
    /**
     * charset string
     * @type {string} */
    this.charset = defined(props.charset, def.charset);
    /**
     * data name
     * @type {string}
     */
    this.name = defined(props.name, def.name);
    /**
     * source url
     * @type {string}
     */
    this.url = defined(props.url, def.url);
    /**
     * hash
     * @type {string}
     */
    this.hash = crypto.createHash('sha256').update(this.data).digest('hex');
  }
}

module.exports = Media;