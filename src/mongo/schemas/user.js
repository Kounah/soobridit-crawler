const mongoose = require('mongoose');

/**
 * @typedef {Object} User
 * @prop {String} name
 */

let schema = new mongoose.Schema({
  name: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports = schema;