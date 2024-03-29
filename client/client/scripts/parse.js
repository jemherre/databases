var Parse = {

  server: `http://127.0.0.1:3000/classes/messages`,

  create: function(message, successCB, errorCB = null) {
    // todo: save a message to the server
    $.ajax({
      url: Parse.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: successCB,
      error: errorCB
    });
  },

  readAll: function(successCB, roomname, errorCB = null) {
    $.ajax({
      url: Parse.server,
      type: 'GET',
      data: { order: '-createdAt', where: roomname },
      contentType: 'application/json',
      success: successCB,
      error: errorCB || function(error) {
        console.error('chatterbox: Failed to fetch messages', error);
      }
    }, console.log());
  }

};
