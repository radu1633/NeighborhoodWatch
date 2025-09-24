import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import Constants from "expo-constants";

const API_BASE_CREATE = `${Constants.expoConfig.extra.API_URL}/api/location`;
const API_BASE_ENTER = `${Constants.expoConfig.extra.API_URL}/api/users/neighborhood`;

export const exitNeighborhood = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_BASE_CREATE}/exitNeighborhood`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return true;
  } else {
    throw new Error("Failed to exit neighborhood");
  }
};

export const submitImageForOCR = async (image) => {
  if (!image) throw new Error("Imaginea nu este selectată!");

  const token = await AsyncStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", {
    uri: image.uri,
    name: "ci.jpg",
    type: "image/jpeg",
  });

  const response = await fetch(
    `${Constants.expoConfig.extra.API_URL}/api/location/extract`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Trimiterea imaginii a eșuat");
  }

  return response.json();
};
