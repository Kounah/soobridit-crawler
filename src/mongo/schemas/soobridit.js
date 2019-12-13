const {Schema} = require('mongoose');

/**
 * @typedef {Object} Soobridit
 * @prop {String} name
 * @prop {Number} members
 */

let schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  members: {
    type: Number
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

module.exports = schema;