const mongoose = require('mongoose');

/**
 * @typedef {Object} Post
 * @prop {String} title
 * @prop {String} url
 * @prop {String} identifier
 * @prop {String} name
 * @prop {String} content
 * @prop {import('./user').User & import('./_jsdoc').MongoObject} author
 * @prop {import('./media').Media & import('./_jsdoc').MongoObject} media
 * @prop {import('./soobridit').Soobridit & import('./_jsdoc').MongoObject} soobridit
 */


let schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  identifier: {
    type: String
  },
  name: {
    type: String
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  media: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Media'
  },
  soobridit: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Soobridit'
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports = schema;
