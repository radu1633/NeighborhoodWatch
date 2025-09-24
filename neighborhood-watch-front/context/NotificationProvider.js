import { useGlobalContext } from "./GlobalProvider";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getMyNotifications } from "@/lib/notifications";
import Constants from "expo-constants";

const API_SOCKET = `${Constants.expoConfig.extra.SOCKET_URL}`;

const NotificationSocketContext = createContext();
export const useNotificationSocketContext = () =>
  useContext(NotificationSocketContext);

const NotificationSocketProvider = ({ children }) => {
  const { user } = useGlobalContext(); // 👈 obține user-ul logat
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user?.id) return; // ⛔ nu face nimic dacă nu e user logat

    const fetchNotifications = async () => {
      setRefreshing(true);
      try {
        const fetched = await getMyNotifications();
        setNotifications(fetched);
      } catch (e) {
        console.error("Eroare la încărcarea notificărilor:", e);
      } finally {
        setRefreshing(false);
      }
    };

    fetchNotifications();

    const socket = new WebSocket(`${API_SOCKET}/notifications`);

    socket.onopen = () => {
      console.log("✅ WS notificări conectat");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("🔔 Notificare nouă:", data);

      // ✅ Filtare: doar notificările adresate user-ului logat
      if (data?.userId === user.id) {
        setNotifications((prev) => [data, ...prev]);
      } else {
        console.log("⛔ Notificare ignorată (nu e pentru userul curent)");
      }
    };

    socket.onerror = (error) => {
      console.error("❌ Eroare WS notificări:", error.message);
    };

    socket.onclose = () => {
      console.warn("🔌 Conexiune WS notificări închisă");
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [user]); // 👈 se reconectează când se schimbă userul

  return (
    <NotificationSocketContext.Provider
      value={{
        socket: socketRef.current,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </NotificationSocketContext.Provider>
  );
};

export default NotificationSocketProvider;
