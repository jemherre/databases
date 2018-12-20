var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) {
      var queryString = 'SELECT message, roomname, username FROM messages INNER JOIN users ON users.id = messages.user_id';
      db.query(queryString, (err, result) => {
        if (err) { throw err; }
        callback(null, result);
      });
    }, // a function which produces all the messages
    post: function (message, username, roomname, callback) {
      db.query('SELECT id FROM users WHERE username = ?', [username], (err, result) => {
        if (err) { throw err; }
        // if the user already exists
        if (result.length > 0) {
          var { id } = result[0];
          var queryString = 'INSERT INTO messages (messages.message, messages.user_id, messages.roomname) VALUES (?, ?, ?)';
          var queryArgs = [message, id, roomname];
          // insert the message with the user id
          db.query(queryString, queryArgs, (err) => {
            if(err)  { throw err; }
            callback();
          });
        } else {
          // if the user doesn't exist, create it
          var queryString = 'INSERT INTO users (username) VALUES (?)';
          db.query(queryString, username, (err) => {
            if (err) { throw err; }
            // then insert the message with that userid
            var queryString = 'INSERT INTO messages (message, user_id, roomname) VALUES (?, LAST_INSERT_ID(), ?)';
            var queryArgs = [message, roomname];
            db.query(queryString, queryArgs, (err) => {
              if (err) { throw err; }
              callback();
            });
          });
        }
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      var queryString = 'SELECT * FROM users';
      db.query(queryString, (err, result) => {
        if (err) { throw err; }
        callback(result);
      });
    },
    post: function (username, callback) {
      db.query('INSERT INTO users (username) VALUES (?)', username, (err) => {
        if (err) { throw err; }
        callback();
      });
    }
  }
};

