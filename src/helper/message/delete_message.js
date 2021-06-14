const Message = require("../../model/message");

const deleteMessage = async (userID) => {
    //Delete message doc corresponding to the id of userID
    await Message.findByIdAndDelete({ _id: userID }, (err, doc) => {
      console.log("Message.findByIdAndDelete " + doc);
    }).catch((err) => {
      console.log(err.message);
    });
  
    //Delete sender users of userID from the any receiver's that contain userID inside the users array
    let filter = { users: { $elemMatch: { _id: userID } } };
    await Message.findOne(filter, (err, doc) => {

      //if no matching doc with userID in the messages collection then do nothing!
      if (!doc) {
        console.log("1 no document found receiver doc");
      } else {
        //else the index at which the item with _id of userID is assigned to userIndex
        let userIndex = doc.users.findIndex(
          (element) => element._id === userID
        );
  
        //if receiver id is found then the user with the corresponding userID is removed 
        if (userIndex !== undefined && userIndex != -1) {
          doc.users.splice(userIndex, 1);
          doc.save();
        } else {
       
          console.log("2 no document found");
        }
      }
    }).catch((err) => {
      console.log(err.message);
    });
  };
  
  module.exports = deleteMessage;
  