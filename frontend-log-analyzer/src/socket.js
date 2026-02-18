import { io } from "socket.io-client";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const socket = io(API_BASE, {
  transports: ["websocket"],
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("Connected to socket:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket");
});

export default socket;
