const mongoose = require("mongoose");
require("dotenv/config");

//mongo client to connect the the mongodb hosted in mongodb cloud
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_CONNECTION_USER_ID}:${process.env.DB_CONNECTION_PASSWORD}@chatcluster.tvjyu.mongodb.net/SimpleChatDB?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then((db) => {
    console.log("Connected to MonogoDB");
  })
  .catch((error) => console.log("Not Connected to MonogoDB due : " + error));
