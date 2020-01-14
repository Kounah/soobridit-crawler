const mongoose = require('mongoose');

/**
 * @typedef {Object} Media
 * @prop {Buffer} data
 * @prop {string} type
 * @prop {number} length
 * @prop {string} charset
 * @prop {string} name
 * @prop {string} url
 * @prop {string} hash
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