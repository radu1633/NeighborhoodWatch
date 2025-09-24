import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = `${Constants.expoConfig.extra.API_URL}/api/notifications`;

export const getMyNotifications = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    return;
  }

  const response = await fetch(`${API_BASE}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
};

export const markAsRead = async (notificationId) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE}/${notificationId}/read`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return response.json();
};

export const deleteNotification = async (notificationId) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE}/${notificationId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete notification");
  }

  return response.text();
};

export const sendEmergecyMessage = async () => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${API_BASE}/emergency`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to send emergency message");
  }

  return response.json();
};
