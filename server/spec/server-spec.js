/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;

describe('Persistent Node Chat Server', function() {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: 'student',
      database: 'chat'
    });
    dbConnection.connect();

    var tablename = 'messages'; // TODO: fill this out

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query('truncate ' + tablename, done);
  });

  afterEach(function() {
    dbConnection.end();
  });

  it('Should insert posted messages to the DB', function(done) {
    // Post the user to the chat server.
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: { username: 'Valjean' }
    }, function () {
      // Post a message to the node chat server:
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'Valjean',
          message: 'In mercy\'s name, three days is all I need.',
          roomname: 'Hello'
        }
      }, function () {
        // Now if we look in the database, we should find the
        // posted message there.

        // TODO: You might have to change this test to get all the data from
        // your message table, since this is schema-dependent.
        var queryString = 'SELECT * FROM messages';
        var queryArgs = [];

        dbConnection.query(queryString, queryArgs, function(err, results) {
          // console.log('results',results);
          // Should have one result:
          expect(results.length).to.equal(1);

          // TODO: If you don't have a column named text, change this test.
          expect(results[0].message).to.equal('In mercy\'s name, three days is all I need.');

          done();
        });
      });
    });
  });

  it('Should output all messages from the DB', function(done) {
    // Let's insert a message into the db
    var queryString = 'INSERT INTO messages (message, roomname, UserId, createdAt, updatedAt) VALUES ("Men like you can never change!", "main", 1, "2018-12-21 02:07:53", "2018-12-21 02:07:53")';

    // TODO - The exact query string and query args to use
    // here depend on the schema you design, so I'll leave
    // them up to you. */

    dbConnection.query(queryString, function(err) {
      if (err) { throw err; }
      // Now query the Node chat server and see if it returns
      // the message we just inserted:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messageLog = JSON.parse(body);
        expect(messageLog[0].message).to.equal('Men like you can never change!');
        expect(messageLog[0].roomname).to.equal('main');
        done();
      });
    });
  });

  it('Should output all users from the DB', function(done) {
    // Let's insert a message into the db
    var queryString = `INSERT INTO users (username, createdAt, updatedAt) VALUES ('Jason', '2018-12-21 02:07:53', '2018-12-21 02:07:53')`;
    var length = 0;
    request('http://127.0.0.1:3000/classes/users', function(error, response, body) {
      var userList = JSON.parse(body);
      length = userList.length;
      dbConnection.query(queryString, function(err) {
        if (err) { throw err; }
        request('http://127.0.0.1:3000/classes/users', function(error, response, body) {
          var newUserList = JSON.parse(body);
          expect(newUserList.length-1).to.equal(length);
          done();
        });
      });
    });
  });

  //duplicate username

  //escape char for security
  it('Should escape message content from Posted messages', function(done) {

    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Valjean',
        message: `<body onload=alert('test1')>`,
        roomname: 'Hello'
      }
    }, function(){
      // Now query the Node chat server and see if it returns
      // the message we just inserted:
      dbConnection.query('SELECT message FROM messages where message = ?',`<body onload=alert('test1')>`,function(err,result){
        if (err) { throw err; }
        expect(result.length).to.equal(1);
        done();
      });
    });
  });

  //created at sorting
  it('Should  sort the messages in order by createdAt', function(done) {

    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Valjean',
        message: `testing sort`,
        roomname: 'Hello'
      }
    }, function(){
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messageLog = JSON.parse(body);
        expect(messageLog[0].message).to.equal('testing sort');
        expect(messageLog[0].roomname).to.equal('Hello');
        done();
      });
    });
  });

  //filtering by room
  it('Should  sort the messages in order by createdAt', function(done) {
    //create post with new room

    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Valjean',
        message: `testing sort`,
        roomname: 'crazyRoomName'
      }
    }, function(){
      request({
        method: 'GET',
        uri: 'http://127.0.0.1:3000/classes/messages',
        query: {
          where: 'crazyRoomName'
        }
      },
      function(error, response, body) {
        var messageLog = JSON.parse(body);
        expect(messageLog.length).to.equal(1);
        // expect(messageLog[0].roomname).to.equal('Hello');
        done();
      });
    });
  });
});
