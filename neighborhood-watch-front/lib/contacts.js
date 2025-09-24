import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_BASE = `${Constants.expoConfig.extra.API_URL}/api/contacts`;

export const getContacts = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_BASE}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data.map((contact) => ({
    id: contact.id,
    userId: contact.contactUser.userId,
    name: `${contact.contactUser.firstName} ${contact.contactUser.lastName}`,
    email: contact.contactUser.email,
    phone: contact.contactUser.phoneNumber,
    image: contact.contactUser.profilePhoto
      ? `${Constants.expoConfig.extra.API_URL}${contact.contactUser.profilePhoto}`
      : null,
    neighborhoodId: contact.contactUser.neighborhoodId,
    emergency: contact.emergency,
  }));
};

export const toggleEmergencyStatus = async (contactId, emergency) => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${API_BASE}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ contactId, emergency }),
  });

  if (!response.ok) {
    throw new Error("Failed to update emergency status");
  }
};

export const getContactNumber = async () => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${API_BASE}/number`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contact number");
  }

  const number = await response.json(); // serverul returnează direct un număr
  return number;
};

export const getContactNumberById = async (id) => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${API_BASE}/number/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contact number");
  }

  const number = await response.json(); // serverul returnează direct un număr
  return number;
};
