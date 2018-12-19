var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) {
      console.log('connected in models get');
      //bring data from all 3 tables, mess, rooms, users
      var queryString = 'SELECT username, roomname, message FROM messages INNER JOIN users ON users.id = messages.id_users;';

      //join user and messages
      db.query(queryString, (err, result) =>{
        if(err) return callback(err);
        callback(null, result);
      });
     
    }, // a function which produces all the messages
    post: function (message, username, roomname, callback) {

      var queryString = 'INSERT INTO messages (message, id_users, roomname) VALUES (?,(SELECT id FROM users WHERE username = ?), ?);';
      var queryArg = [message, username, roomname];
      db.query(queryString, queryArg, (err)=>{
        if(err) return callback(err);
        callback();
      });

    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      console.log('connected in models get');
      //bring data from all 3 tables, mess, rooms, users
      var queryString = 'SELECT * FROM users';
      db.query(queryString, (err, result)=>{
        if(err) callback(err);
        callback(result);
      });
    },
    post: function (username, callback) {
      db.query('SELECT id FROM users WHERE username = ?', username, (err, result) => {
        if (err) throw err;
        if (result.length >= 1) {
          return callback();
        }
        db.query('INSERT INTO users (username) VALUES (?)', [username], (err)=>{
          if(err)  callback(err);
            callback();
          });
      });
    }
  }
};

