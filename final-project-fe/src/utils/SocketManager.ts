import { io } from "socket.io-client";

// initializing the socket connection
let socket = io("https://final-project-2vdl.onrender.com");

export default socket;
