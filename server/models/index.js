var {db, User, Message} = require('../db');

module.exports = {
  messages: {
    get: function (roomname, callback) {
      db.sync()
        .then(()=>{
          if(roomname) {return Message.findAll({include: [User], where: {roomname}, order: [['createdAt', 'DESC']]});}
          return Message.findAll({include: [User], order: [['createdAt', 'DESC']]});
        })
        .then((messages)=>{
          //create res obj based
          var resObj = messages.map((message)=>{
            return Object.assign({},{
              username: message.User.username,
              message: message.message,
              roomname: message.roomname,
              createdAt: message.createdAt
            });
          });
          callback(resObj);
        });

    }, // a function which produces all the messages
    post: function (message, username, roomname, callback) {
      db.sync()
        .then(()=>{
          return User
            .findOrCreate({where: {username}})
            .spread((user)=>{
              return user.id;
            });
        })
        .then((id)=>{
          return Message.create({UserId: id, message, roomname});
        })
        .then(() => {
          callback();
        });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      db.sync()
        .then(()=>{
          return User.all();
        })
        .then((users)=>{
          //create res obj based
          var resObj = users.map((user)=>{
            return Object.assign({},{
              username: user.username
            });
          });
          callback(resObj);
        });
    },
    post: function (username, callback) {
      db.sync()
        .then(()=>{
          return User.create({username});
        })
        .then(()=>{
          callback();
        });
    }
  }
};

