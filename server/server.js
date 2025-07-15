import  express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { ConnectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";


// Create Express app and HTTP server 

const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io =  new Server(server,{
  cors:{origin:"*"}
})

// Store online users
export const userSocketMap = {};  // {userId : socketId}

// Socket.io connectio handler
io.on("connection", (socket)=>{
  const userId = socket.handshake.query.userId;
  console.log('User Connected', userId, socket.id);


  if(userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", ()=>{
    console.log("User Disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })
})

// Middleware Setup
app.use(express.json({limit: "4mb"}));
app.use(cors());

// Routes setup
app.use("/api/status", (req, res)=>{
    res.send("Server is Live")
})
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

// Connect to MongoDB
await ConnectDB();


// Start the server

if(process.env.NODE_ENV === "production"){
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}


// Export the server for Vercel
export default app;

