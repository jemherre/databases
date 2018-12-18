var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get((err,results)=>{
        if(err) throw err;
        return JSON.stringify(results);
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      //invoke post model
      var {text, user, roomname} = req.body;
      models.messages.post(text,user,roomname, (err)=>{
        if(err) throw err;
        console.log('MESSAGE POST SUCCESSFUL');
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get((err,results)=>{
        if(err) throw err;
        return JSON.stringify(results);
      });
    },
    post: function (req, res) {
      var user = req.body;
      models.users.post(user, (err)=>{
        if(err) throw err;
        console.log('USER POST SUCCESSFUL');
      });
    }
  }
};

