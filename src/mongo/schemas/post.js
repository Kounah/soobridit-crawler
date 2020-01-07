const mongoose = require('mongoose');

/**
 * @typedef {Object} Post
 * @prop {string} title
 * @prop {string} content
 * @prop {string} url
 * @prop {string} name
 * @prop {string} fullname
 * @prop {number} score
 * @prop {number} timestamp
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
  name: {
    type: String
  },
  fullname: {
    type: String
  },
  score: {
    type: Number
  },
  timestamp: {
    type: Numbers
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
