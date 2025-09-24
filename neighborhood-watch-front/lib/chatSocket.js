import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { sendChatMessage } from "./notifications";

const API_BASE = `${Constants.expoConfig.extra.API_URL}/api/messages`;
const API_SOCKET = `${Constants.expoConfig.extra.SOCKET_URL}/chat`;

let socket = null;

export const connectToChat = (onMessage) => {
  socket = new WebSocket(`${API_SOCKET}`);

  socket.onopen = () => {
    console.log("✅ WebSocket deschis");
  };

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    onMessage(msg);
  };

  socket.onerror = (error) => {
    console.error("❌ Eroare WebSocket:", error.message);
  };

  socket.onclose = () => {
    console.log("❌ Conexiune WebSocket închisă");
  };
};

export const disconnectFromChat = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export const sendMessage = ({ userId, neighborhoodId, message }) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const payload = {
      userId,
      neighborhoodId,
      message,
    };
    socket.send(JSON.stringify(payload));
  } else {
    console.warn("⚠️ WebSocket nu este conectat.");
  }
};

export const getMessagesByNeighborhood = async (neighborhoodId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_BASE}/${neighborhoodId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const data = await response.json();
  return data;
};
