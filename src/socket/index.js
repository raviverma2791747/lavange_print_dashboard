//@ts-nocheck
import { io } from "socket.io-client";
import { notifications_store } from "../helper/store";


export const socket = io("ws://localhost:3132", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

socket.on("connect", () => {
  console.log("connected");
});

socket.on("disconnect", () => {
  console.log("disconnected");
});

socket.on("message", (message) => {
  console.log(message);
});

socket.on("notify", (message) => {
  console.log(message);

  notifications_store.update((notifications) => {
    return [...notifications, message];
  })
});

export const sendMessage = (message) => {
  socket.emit("message", message);
};
