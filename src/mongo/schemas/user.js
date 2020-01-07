const mongoose = require('mongoose');

/**
 * @typedef {Object} User
 * @prop {String} name
 * @prop {String} fullname
 */

let schema = new mongoose.Schema({
  name: {
    type: String
  },
  fullname: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports = schema;