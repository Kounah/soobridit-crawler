const mongoose = require('mongoose');

/**
 * @typedef {Object} Media
 * @prop {Buffer} data
 * @prop {String} type
 * @prop {Number} length
 * @prop {String} charset
 * @prop {String} name
 * @prop {String} url
 */

let schema = new mongoose.Schema({
  data: {
    type: Buffer
  },
  type: {
    type: String
  },
  length: {
    type: Number
  },
  charset: {
    type: String
  },
  name: {
    type: String
  },
  url: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports = schema;