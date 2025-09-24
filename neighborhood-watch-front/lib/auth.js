import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { getCurrentUser } from "@/lib/user";
import { Alert } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const API_BASE = `${Constants.expoConfig.extra.API_URL}/auth`;

const sendPushTokenToBackend = async () => {
  const token = await AsyncStorage.getItem("token");

  let expoPushToken = null;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === "granted") {
      expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;

      await fetch(`${Constants.expoConfig.extra.API_URL}/api/push-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: expoPushToken }),
      });
    }
  }
};

export const register = async (user) => {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      return { error: response.statusText };
    }
    const result = await response.json();
    console.log("Result:", response);
    if (!result.token) {
      console.error("Logare eșuată", "Niciun token primit");
      return;
    }

    await AsyncStorage.setItem("token", result.token);
    await sendPushTokenToBackend();
    const userData = await getCurrentUser();

    return userData;
  } catch (err) {
    //console.error("Login failed:", err);
    Alert.alert("Error", "Completați corerct toate câmpurile");
  }
};

export const login = async (email, password) => {
  console.log(Constants.expoConfig.extra);

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!result.token) {
      console.error("Logare eșuată", "Niciun token primit");
      return;
    }

    await AsyncStorage.setItem("token", result.token);
    await sendPushTokenToBackend();
    const userData = await getCurrentUser();

    return userData;
  } catch (err) {
    console.error("Login failed:", err);
    Alert.alert("Logare eșuată", "Credențiale invalide");
  }
};

export const logout = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${API_BASE}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      await AsyncStorage.removeItem("token");
      router.replace("/(auth)/sign-in");
    }
  } catch (err) {
    console.error("Logout failed:", err);
    Alert.alert("Error", "Logout failed");
  }
};
