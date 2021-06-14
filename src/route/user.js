const router = require("express").Router();
const User = require("../model/user");

//save user info to mongodb at login
router.post("/login", async (req, res) => {
  try {
    //get the User doc containing the email: req.body.email
    const document = await User.findOne({ email: req.body.email });
    if(document !=null){
          console.log("/login post router SUCCESS - document found in DB");
          res.sendStatus(200);
    }else{
      //if the doc is not in the db it saves it in the db 
      const newDocument = new User({
        email: req.body.email,
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
      });
      const saveDocument = await newDocument.save();
      console.log("/login post router SUCCESS - saving new document");
      res.status(201).json({userdata: saveDocument});
      
    }
  } catch (error) {
    console.log("/login post router FAILED");
    res.status(500).json({ message: error });
  }
});

//delete user from mongodb at logout
router.delete("/logout/:id", async (req, res) => {
   try {
    const removeDocumnet = await User.findByIdAndDelete({
      _id: req.params.id,
    });
    console.log("/logout delete router SUCCESS");
    res.status(200).json(removeDocumnet);

  } catch (error) {
    console.log("/logout delete router FAILED");
    res.json({ message: error });
  }
});

//get all users information
router.get("/userlist", async (req, res) => {
  try {
    const document = await User.find();
      console.log("/userlist get router SUCCESS");
    res.status(200).json(document);

    
  } catch (error) {
    console.log(`/userlist get router FAILED : ${error}`);
     res.json({ message: error });
  }
});

//get user information
router.get("/userinfo", async (req, res) => {
    try {
      const document = await User.findOne({ email: req.body.email });
         console.log("/userinfo get router SUCCESS");
      res.status(200).json(document);
  
      
    } catch (error) {
      console.log("/userinfo get router FAILED");
      res.json({ message: error });
    }
  });

module.exports = router;
