let connect = () => {
  const id = document.cookie.split("; ")[0].replace("id=", "");
  const socketURL =
    window.location.href.replace("http://", "ws://") + "/" + id + "/ws";

  var socket = new WebSocket(socketURL);
  console.log("Attempting Connection...");

  socket.onopen = () => {
    console.log("Successfully Connected");
  };

  socket.onmessage = (msg) => {
    console.log(msg);
  };

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
    alert("Invalid login");

    //TODO: redirect to an error page
    window.location.replace(window.location.href.replace("/game", ""));
  };

  socket.onerror = (error) => {
    console.log("Socket Error: ", error);
  };

  // socket.send

  // socket.addEventListener("/join", () => )

  // const id = document.cookie.split("; ")[0].replace("id=", "");
  // const socketURL =
  //   window.location.href.replace("http://", "ws://") + "/" + id + "/ws";
  // class Sockets {
  //   constructor(socket = new WebSocket(socketURL), ee = new EventEmitter())
};

export { connect };
