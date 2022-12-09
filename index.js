// //run node server on cmd because powershell is laaagy
// import express from "express";
// import cors from "cors";

// import { createServer } from "http";
// import { Server } from "socket.io";

// const PORT = 4500;
// const app = express();

// app.use(cors());
// app.get("/", (req, res) => {
//   res.send("Real TIme server");
// });
// const httpServer = createServer();
// const io = new Server(httpServer);

// io.on("connection", (socket) => {
//   console.log("New Connetion: ");
// });

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
const PORT = 4500 || process.env.PORT;
const app = express();
app.use(cors()); //cors is used for inter communication between url  Cross-Origin Resource Sharing (CORS)

const users = [{}];
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});
app.get("/", (req, res) => {
  res.send("Real TIme server");
});

io.on("connection", (socket) => {
  console.log("Connection established");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined `);

    //jisne join kiya hai usko chod ke sabka msg aayaea
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: ` ${users[socket.id]} has joined`,
    });
    //will shown to only that person who have logged in
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat,${users[socket.id]} `,
    });
  });
  socket.on("disconnect", () => {
    //rest will know this user left
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]}  has left`,
    });
    console.log(`user left`);
  });


  socket.on("message",({message,tid})=>{
    //sabhike bhejdenge msg  user and its msg
    console.log(tid);
    console.log(message)
    io.emit("sendMessage", { user: users[tid], message, tid });
  })



});
// });

httpServer.listen(PORT, () => {
  console.log(`listening on server http://localhost:${PORT}`);
});
