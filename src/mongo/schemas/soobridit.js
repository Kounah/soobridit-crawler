const {Schema} = require('mongoose');

/**
 * @typedef {Object} Soobridit
 * @prop {String} name
 * @prop {String} fullname
 * @prop {Number} members
 */

let schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  fullname: {
    type: String,
    unique: true,
    required: true
  },
  members: {
    type: Number
  },
  type: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports = schema;