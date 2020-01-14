const defined = require('kouna-lib/functions/defined');
const extend = require('kouna-lib/functions/extend');
const url = require('url');

/**@type {Class} */
const defaults = {
  url: { href: 'mongodb://localhost:27017/soobridit' },
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};

class MongoConfig {
  /**
   * creates a new MongoConfig
   * @param {Class} props 
   */
  constructor(props) {
    if(typeof props === 'string')
      props = url.parse(props);
    else if(typeof props !== 'object')
      props = defaults;

    /**@type {import('url').URL} */
    this.url;
    switch(typeof props.url) {
      case 'object':
        this.url = url.parse(url.format(props.url));
        break;
      case 'string':
        this.url = url.parse(props.url);
        break;
      default: this.url = url.parse(url.format(defaults.url));
    }

    /**@type {import('mongoose').ConnectionOptions} */
    this.connectionOptions = extend(defaults.connectionOptions, props.connectionOptions);
  }
}

/**@typedef {MongoConfig} Class*/

module.exports = MongoConfig;