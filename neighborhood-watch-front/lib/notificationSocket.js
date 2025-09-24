//const API_BASE =
import Constants from "expo-constants";

let socket = null;
const API_BASE = `${Constants.expoConfig.extra.API_URL}/api/notifications`;

export const connectToNotification = (onNotificationReceived) => {
  socket = new WebSocket(
    `${Constants.expoConfig.extra.SOCKET_URL}/notifications`
  );

  socket.onopen = () => {
    console.log("✅ WebSocket notificări conectat");
  };

  socket.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    console.log("🔔 Notificare primită:", notification);
    onNotificationReceived(notification);
  };

  socket.onerror = (error) => {
    console.error("❌ Eroare WebSocket notificări:", error.message);
  };

  socket.onclose = () => {
    console.warn("🔌 WebSocket notificări închis");
  };
};

export const disconnectNotificationSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
