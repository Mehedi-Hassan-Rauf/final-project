import { io } from "socket.io-client";

// initializing the socket connection
let socket = io("https://final-project-be-five.vercel.app");

export default socket;
