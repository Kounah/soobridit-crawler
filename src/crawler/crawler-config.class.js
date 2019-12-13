const defined = require('kouna-lib/fn/defined');
const extend = require('kouna-lib/fn/extend');

/**@typedef {('http'|'https')} Protocol */
/**@typedef {('hot'|'new'|'rising'|'controversial'|'top'|'gilded')} SoobriditCategory */
/**@typedef {('old'|'current'|'api')} CrawlerType */

/**@type {Class} */
const defaults = {
  protocol: 'https',
  host: 'old.reddit.com',
  type: 'old',
  soobridit: ''
};

class CrawlerConfig {
  /**
   * @param {Class} props
   */
  constructor(props) {
    if(typeof props !== 'object' || props === null)
      props = defaults;

    /**@type {Protocol} */
    this.protocol = defined(props.protocol, defaults.protocol);
    /**@type {string} */
    this.host = defined(props.host, defaults.host);
    /**@type {CrawlerType} */
    this.type = defined(props.type, defaults.type);
    /**@type {SoobriditCategory} */
    this.soobriditCategory = defined(props.category, defaults.category);
    /**@type {string} */
    this.soobridit = defined(props.soobridit, defaults.soobridit);

    /**@type {import('../mongo/mongo-config.class').Class} */
    this.mongo = extend(defaults.mongo, props.mongo);
  }
}

/**@typedef {CrawlerConfig} Class */

module.exports = CrawlerConfig;