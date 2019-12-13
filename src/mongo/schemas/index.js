/**
 * @function
 * @param {import('mongoose').Connection} connection
 * @returns {import('mongoose').Model<import('mongoose').Document>}
 */
function CreateModelFunction(connection){};

/**
 * @param {import('mongoose').Connection} connection
 * @param {string} name
 * @param {import('mongoose').Schema} schema 
 * @returns {CreateModelFunction}
 */
function fn(name, schema) {
  return function(connection) {
    return connection.model(name, schema);
  }
}

module.exports = {
  soobridit: fn('Soobridit', require('./soobridit')),
  post: fn('Post', require('./post')),
  comment: fn('Comment', require('./comment')),
  user: fn('User', require('./user')),
  media: fn('Media', require('./media'))
};