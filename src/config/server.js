const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

app.use(cors());
app.use(express.json());

const userRouter = require("../route/user");
const messageRouter = require("../route/message");

app.use("/user", userRouter);
app.use("/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello Chat");
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, "0.0.0.0",() => console.log(`Server started on port ${PORT}`));

module.exports = server;
