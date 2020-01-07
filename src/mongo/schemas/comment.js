const mongoose = require('mongoose');

/**
 * @typedef {Object} Comment
 * @prop {import('./user').User & import('./_jsdoc').MongoObject} author
 * @prop {import('./post').Post & import('./_jsdoc').MongoObject} post
 * @prop {Comment & import('./_jsdoc').MongoObject} parent
 * @prop {string} content
 */

let schema = new mongoose.Schema({
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Post'
  },
  parent: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Comment'
  },
  media: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Media'
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports = schema;