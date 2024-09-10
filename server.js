import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.static("public"));

const server = http.createServer(app);
const io = new Server(server);

const users = new Map(); 
const userRooms = new Map(); 
const usermobile = new Map(); 


io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("user-name", (username) => {
    users.set(socket.id, username);
   
  });

  socket.on("join-room", (data) => {
    socket.join(data.room);
    userRooms.set(socket.id, data.room);
    usermobile.set(data.phoneNumbers, socket.id);

    const username = users.get(socket.id);
    const timestamp = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    socket.to(data.room).emit("user-connected", `${username} has connected`, socket.id, timestamp);
  });

  socket.on("chat-message", (message) => {
    const room = userRooms.get(socket.id);
    if (room) {
      const timestamp = new Date().toLocaleTimeString([], { 
        hour:'2-digit', 
        minute:'2-digit' 
      });
      socket.to(room).emit("chat-message", message, users.get(socket.id), timestamp); // Send message with timestamp
    } else {
      console.error(`Room for socket ID ${socket.id} is undefined.`);
    }
  });

  socket.on("check-number", (number) => {
    const foundUser = Array.from(usermobile).find(([phoneNumber, socketId]) => phoneNumber === number);

    if (foundUser) {
      const foundSocketId = foundUser[1];
      console.log(`User found with phone number ${number}: ${foundSocketId}`);

      const room = userRooms.get(socket.id); 
      const existname = users.get(socket.id);
      if (room) {
        const newUserSocket = io.sockets.sockets.get(foundSocketId);

        if (newUserSocket) {
          newUserSocket.join(room);

          const newUsername = users.get(foundSocketId);
          const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });

          newUserSocket.to(room).emit("notification", `${newUsername} connected to the room`, socket.id, timestamp);
          newUserSocket.emit("personal-notification", `${existname} connected using your phone number`, socket.id, timestamp);
        } else {
          console.error(`No socket found for socket ID ${foundSocketId}.`);
        }
      } else {
        console.error(`Room for current socket ID ${socket.id} is not defined.`);
      }
    } else {
      console.error(`No user found with phone number ${number}.`);
    }
  });

  socket.on("disconnect", () => {
    const disconnectedUser = users.get(socket.id);
    const room = userRooms.get(socket.id);
    if (disconnectedUser && room) {
      socket.to(room).emit("disconnected", `${disconnectedUser} has disconnected`);
    }
    users.delete(socket.id);
    userRooms.delete(socket.id);
    console.log(`User with socket ID ${socket.id} has disconnected.`);
  });
});

server.listen(3002, () => {
  console.log(`Server is listening on port 3002`);
});
