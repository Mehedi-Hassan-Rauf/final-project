import { Server } from "socket.io";
import { corsConfig } from "./constants";
let io: any;

export const init = (httpServer: any) => {
  io = new Server(httpServer, {
    // cors: corsConfig
    cors: {
      origin: 'http://localhost:3000',  // Frontend URL
      methods: ["GET", "POST"],
      credentials: true  
    }
  });
  
  return io;
}

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized..!");
  }
  return io;
}