const router = require("express").Router();
const Message = require("../model/message");

router.post("/fetchmessage", async (req, res) => {
  let senderID = req.body.sender;
  let receiverID = req.body.receiver;

  try {
    //find and returns the doc containing the matching _id: receiverID in the users list
    const document = await Message.find(
      { _id: senderID },
      {
        users: {
          $elemMatch: { _id: receiverID },
        },
      }
    );

    
    if (document.length > 0) {
      if (document[0].users.length > 0) {
        const messages = document[0].users[0].messages;
        const responeMessage = messages.slice(
          Math.max(messages.length - 15, 0)
        );

        res.status(200).json(responeMessage);
      } else {
        res.send([]);
      }
    } else {
      res.send([]);
    }
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
