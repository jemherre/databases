var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) {
      db.connect((err)=>{
        if(err) throw err;
        console.log('connected in models get');
        //bring data from all 3 tables, mess, rooms, users
        var queryString = 'SELECT * FROM messages';
        db.query(queryString, (err, result)=>{
          if(err) throw err;
          callback(result);
        });
      });
    }, // a function which produces all the messages
    post: function (text, user, roomName, callback) {
      db.connect((err)=> {
        if(err) throw err;
        var queryArg =[text, user, roomName];
        db.query('INSERT INTO rooms (name) VALUES (?)',roomName, (err)=>{
          if(err)  throw err;
          db.query('INSERT INTO users (name) VALUES (?)',user, (err)=>{
            if(err)  throw err;
            var queryString = 'INSERT INTO messages (text, id_users, id_rooms) VALUES (?,(SELECT id FROM users WHERE name = ?),(SELECT id FROM rooms WHERE name = ?))';
            var queryArg = [text, user, roomName];
            db.query(queryString, queryArg, (err)=>{
              if(err) throw err;
              callback();
            });
          });
        });
      })

    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      db.connect((err)=>{
        if(err) throw err;
        console.log('connected in models get');
        //bring data from all 3 tables, mess, rooms, users
        var queryString = 'SELECT * FROM users';
        db.query(queryString, (err, result)=>{
          if(err) throw err;
          callback(result);
        });
      });
    },
    post: function (user, callback) {
      db.connect((err)=>{
        db.query('INSERT INTO users (name) VALUES (?)',user, (err)=>{
          if(err)  throw err;
            callback();
          });
      });
    }
  }
};

