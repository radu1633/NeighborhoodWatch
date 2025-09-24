import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_BASE = `${Constants.expoConfig.extra.API_URL}/api/comments`;

export const getComments = async (incidentId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_BASE}/${incidentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  const data = await response.json();

  return data.map((comment) => ({
    id: comment.id,
    author: comment.author,
    authorPicture: comment.authorPicture
      ? `${Constants.expoConfig.extra.API_URL}${comment.authorPicture}`
      : null,
    text: comment.text,
    timestamp: comment.timestamp,
  }));
};

export const addComment = async (incidentId, text) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ incidentId, text }),
  });

  if (!response.ok) {
    throw new Error("Failed to add comment");
  }

  return await response.text();
};

export const deleteComment = async (commentId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_BASE}/delete/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }

  return await response.text();
};
