const MongoConfig = require('./mongo-config.class.js');
const schemas = require('./schemas');
const mongoose = require('mongoose');
const asyncQueue = require('kouna-lib/functions/async-queue');

/**@typedef {import('./mongo-config.class').Class} Config*/
/**
 * @template T
 * @typedef {import('mongoose').Model<import('mongoose').MongooseDocument, T>} Model */

/**@typedef {import('./schemas/comment').Comment & import('./schemas/_jsdoc').MongoObject} MongoComment */
/**@typedef {import('./schemas/media').Media & import('./schemas/_jsdoc').MongoObject} MongoMedia */
/**@typedef {import('./schemas/soobridit').Soobridit & import('./schemas/_jsdoc').MongoObject} MongoSoobridit */
/**@typedef {import('./schemas/user').User & import('./schemas/_jsdoc').MongoObject} MongoUser */

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

    /**@type {Model.<MongoComment>} */
    this.mComment;
    /**@type {Model.<MongoMedia>} */
    this.mMedia;
    /**@type {Model.<MongoSoobridit>} */
    this.mSoobridit;
    /**@type {Model.<MongoUser>} */
    this.mUser;

    this.connect = this.connect.bind(this);
  }

  async connect() {
    this.connection = await mongoose.createConnection(
      this.config.url.toString(),
      this.config.connectionOptions);
    this.mComment = schemas.comment(this.connection);
    this.mMedia = schemas.media(this.connection);
    this.mSoobridit = schemas.soobridit(this.connection);
    this.mUser = schemas.user(this.connection);
  }

  /**
   * finds or creates comment
   * @param {MongoComment} comment
   * @returns {Promise.<Model.<MongoComment>>}
   */
  async comment(comment) {
    if(typeof comment._id !== 'undefined')
      return await this.mComment.findById(comment._id)

    // find comment
    let _comment = await this.mComment.findOne({
      fullname: comment.fullname
    }).exec();

    // return comment if it already exists
    if(typeof _comment === 'object' && _comment !== null) {
      await this.mComment.updateOne({_id: _comment._id}, {
        $set: {
          score: comment.score
        }
      }).exec();

      return await this.mComment.findById(_comment._id);
    }

    let _author = await this.user(comment.author);
    let _media = await this.media(comment.media);
    let _soobridit = await this.soobridit(comment.soobridit);
    let _children = await asyncQueue(comment.children, async (item) => {
      return await this.comment(item);
    });

    // set stuff
    comment.author = _author._id;
    comment.media = _media._id;
    comment.soobridit = _soobridit._id;
    comment.children = _children;

    let _created = await this.mComment.create(comment);

    if(typeof comment.$parent !== 'undefined') {
      let _parent = await this.comment(comment.$parent);
      await this.mComment.updateOne({
        _id: _parent._id
      }, {
        $push: {
          children: _created._id
        }
      })
    }

    return _created;
  }

  /**
   * finds or creates soobridit
   * @param {MongoSoobridit} soobridit 
   * @returns {Promise.<Model.<MongoSoobridit>>}
   */
  async soobridit(soobridit) {
    if(typeof soobridit._id !== 'undefined')
      return this.mSoobridit.findById(soobridit._id);

    let _soobridit = await this.mSoobridit.findOne({
      fullname: soobridit.fullname
    }).exec();

    if(typeof _soobridit === 'object' && _soobridit !== null) {
      await _soobridit.update(soobridit);
    }

    return await this.mSoobridit.create(soobridit);
  }

  /**
   * 
   * @param {MongoUser} user 
   * @returns {Promise.<Model.<MongoUser>>}
   */
  async user(user) {
    if(typeof user._id !== 'undefined')
      return await this.mUser.findById(user._id);

    let _user = await this.mUser.find({
      fullname: user.fullname
    });

    if(typeof _user !== 'object' || _user === null)
      _user = await this.mUser.create(comment.author);
  }
}

/**@typedef {Mongo} Class */

module.exports = Mongo;