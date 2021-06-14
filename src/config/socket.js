const server = require("./server");
const io = require("socket.io")(server);

const saveMessage = require("../helper/message/save_message");
const deleteMessage = require("../helper/message/delete_message");
const User = require("../model/user");

let connectSockets = [];

io.on("connection", (socket) => {
  console.log("Connected to Socket : " + socket.id);

  socket.on("userData", async (connectData) => {
    let index = checkConnectedSocketIndex(socket.id);
    //if the isSocketRegisterd is false the new socket is pushed to connectSockets list and
    //the User collection is broadcasted to "loggedInUser"
    if (index < 0) {
      console.log("1 Connected to Socket : " + socket.id);
      // Join the Room
      socket.join(connectData.id);
      connectSockets.push({ socket: socket.id, userID: connectData.id });
      //get User all user documents from db
      const document = await User.find();
      //broadcast all Users from the db in a JSON format
      socket.broadcast.emit("loggedInUser", JSON.stringify([...document]));
    }
  });

  socket.on("disconnect", async () => {
    let index = checkConnectedSocketIndex(socket.id);
    if (index !== undefined && index != -1) {
      //delete user from sender and any receivers docs
      deleteMessage(connectSockets[index].userID);
      // Leave From Room
      //socket.leave(disconnectData.id);
      connectSockets.splice(index, 1);
      //get User all user documents from db
      const document = await User.find();
      console.log("Disconnected from Socket");
      //broadcast all Users from the db in a JSON format
      socket.broadcast.emit("loggedInUser", JSON.stringify([...document]));
    }
  });

  socket.on("send_message", (message) => {
    receiverChatID = message.receiverChatID;
    senderChatID = message.senderChatID;
    createdAt = message.createdAt;
    messageContent = message.content;
    

    //save content in the senders doc
    saveMessage(messageContent, senderChatID, receiverChatID, createdAt, true);
    //save content in the receivers doc
    saveMessage(messageContent, receiverChatID, senderChatID, createdAt, false);

    socket.to(receiverChatID).emit("receive_message", {
      content: messageContent,
      senderChatID: senderChatID,
      receiverChatID: receiverChatID,
      createdAt: createdAt,
    });
  });
});

const checkConnectedSocketIndex = (socketID) => {
  let index;
  //if connectSockets list is empty the isSocketRegistered is set to false
  if (connectSockets.length > 0) {
    //check whether there is a matching socket.id available in the connectSockets
    return (index = connectSockets.findIndex(
      (element) => element.socket === socketID
    ));
  } else {
    return (index = -1);
  }
};
