var MessageView = {

  render: _.template(`
      <div class="chat">
        <div class="username"><%=username%></div>
        <div class="text <%=friendStatus%>"><%=message%></div>
        <div class="roomname"><%=roomname%></div>
      </div>
    `)

};