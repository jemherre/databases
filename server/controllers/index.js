var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      console.log('req: ',req);
      models.messages.get(req.query.where, (results) => {
        // if (err) { throw err; }
        res.send(results);
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      //invoke post model
      var { message, username, roomname } = req.body;
      models.messages.post(message, username, roomname, () => {
        // if (err) { throw err; }
        console.log('MESSAGE POST SUCCESSFUL');
        res.send();
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get((results) => {
        // if (err) { throw err; }
        res.send(results);
      });
    },
    post: function (req, res) {
      var { username } = req.body;
      models.users.post(username, () => {
        // if (err) { throw err; }
        console.log('USER POST SUCCESSFUL');
        res.send();
      });
    }
  }
};
