const Message = require("../../model/message");

const saveMessage = (messageContent, sender, receiver, createdAt, isMy) => {
    //intialising a Message Model with receiver and sender id and the message content
    let messageDetails = {
      isMy: isMy,
      message: messageContent,
      createdAt: createdAt,
    };
  
    let message = new Message({
      _id: sender,
      users: [
        {
          _id: receiver,
          messages: messageDetails,
        },
      ],
    });
  
    Message.findOne({ _id: sender }, (err, doc) => {
      //if no matching doc to sender id in the messages collection then the message is saved!
console.log('doc at saveMessage');

      if (!doc) {
        message.save();
      } else {
        //else there is a matching user of sender id in the message doc
        //the receiver id is checked and if available the index is assigned to userIndex
        let userIndex = doc.users.findIndex(
          (element) => element._id === receiver
        );
  
        //if receiver id is found then the message is pushed to the messages list in the particular receiver id and the doc is saved
        if (userIndex !== undefined && userIndex != -1) {
          doc.users[userIndex].messages.push(messageDetails);
          doc.save();
        } else {
          //else the message doc is pushed as a new item
          doc.users.push({
            _id: receiver,
            messages: messageDetails,
          });
          doc.save();
        }
      }
    }).catch((err) => {
      console.log(err.message);
    });
  };

  module.exports = saveMessage;