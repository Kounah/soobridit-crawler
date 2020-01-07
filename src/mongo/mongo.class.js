const MongoConfig = require('./mongo-config.class.js');
const schemas = require('./schemas');
const mongoose = require('mongoose');

/**@typedef {import('./mongo-config.class').Class} Config*/
/**@typedef {import('mongoose').Model<import('mongoose').Document>} Model */

class Mongo {
  /**
   * creates a new instance of mongo
   * @param {Config} config
   */
  constructor(config) {
    if(typeof config !== 'object'
    || config === null)
      config = new MongoConfig(config);

    /**@type {Config} */
    this.config = config;
    /**@type {import('mongoose').Connection} */
    this.connection;

    /**@type {Model & import('./schemas/comment').Comment} */
    this.mComment;
    /**@type {Model & import('./schemas/media').Media} */
    this.mMedia;
    /**@type {Model & import('./schemas/post').Post} */
    this.mPost;
    /**@type {Model & import('./schemas/soobridit').Soobridit} */
    this.mSoobridit;
    /**@type {Model & import('./schemas/user').User} */
    this.mUser;

    this.connect = this.connect.bind(this);
  }

  async connect() {
    this.connection = await mongoose.createConnection(
      this.config.url.toString(),
      this.config.connectionOptions);
    this.mComment = schemas.comment(this.connection);
    this.mMedia = schemas.media(this.connection);
    this.mPost = schemas.post(this.connection);
    this.mSoobridit = schemas.soobridit(this.connection);
    this.mUser = schemas.user(this.connection);
  }

  /**
   * 
   * @param {import('./schemas/post').Post} post 
   */
  async savePost(post) {
    let _post = await this.mPost.findOne({
      fullname: post.fullname
    });

    let _soobridit = await this.mSoobridit.findOne({
      fullname: post.soobridit.fullname
    });

    let _author = await this.mUser.findOne({
      fullname: post.author.fullname
    });

    let _media = await this.mUser.findOne({

    });

    if(typeof _post === 'object' && _post !== null) {
      // post exists ... update stuff
      _post.score = post.score;
    } else {
      /**@type {import('./schemas/post').Post} */
      let _props = {
        
      }

      _post = await this.mPost.create(_props)
    }
    await _post.save();
  }

  /**
   * @param {import('./schemas/comment').Comment} comment
   */
  saveComment(comment, post) {
    let _post = await this.mPost.findOne({

    })

    let _author = await this.mUser.findOne({
      fullname: comment.author.fullname
    })
  }
}

/**@typedef {Mongo} Class */

module.exports = Mongo;