import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_BASE = `${Constants.expoConfig.extra.API_URL}/api/users`;

export const getCurrentUser = async () => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${API_BASE}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const user = await response.json();

  return {
    id: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profilePhoto: user.profilePhoto
      ? `${Constants.expoConfig.extra.API_URL}${user.profilePhoto}`
      : null,
    neighborhoodId: user.neighborhoodId,
    admin: user.admin, // dacă vrei și acest flag
  };
};

export const updateUser = async (data) => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${API_BASE}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user data");
  }

  return response.json();
};

export const updateUserImage = async (result) => {
  const token = await AsyncStorage.getItem("token");

  const imageUri = result.assets[0].uri;
  const filename = imageUri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;

  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: filename,
    type: type,
  });

  const response = await fetch(`${API_BASE}/profile-photo`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update user image");
  }

  return response.text();
};
