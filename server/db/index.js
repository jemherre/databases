var  Sequelize = require('sequelize');

//
var db  = new Sequelize('chat','root','student'); //db, user, pass
//create user and message tables
var User = db.define('User', {username: Sequelize.STRING});
var Message = db.define('Message', {roomname: Sequelize.STRING, message: Sequelize.STRING});
//create connection of foreign key to primary key
Message.belongsTo(User);

db.sync();

module.exports = {db, User, Message};

