const mongoose = require('mongoose');

/**
 * @typedef {Object} Comment
 * @prop {string} title
 * @prop {string} type
 * @prop {string} url
 * @prop {string} fullname
 * @prop {number} score
 * @prop {number} timestamp
 * @prop {Comment & import('./_jsdoc').MongoObject} $parent
 * @prop {import('./user').User & import('./_jsdoc').MongoObject} author
 * @prop {import('./media').Media & import('./_jsdoc').MongoObject} media
 * @prop {import('./soobridit').Soobridit & import('./_jsdoc').MongoObject} soobridit
 * @prop {Array.<import('./comment').Comment & import('./_jsdoc').MongoObject>} children
 */


let schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  fullname: {
    type: String
  },
  score: {
    type: Number
  },
  timestamp: {
    type: Number
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
  },
  children: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: 'Comment'
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports = schema;
