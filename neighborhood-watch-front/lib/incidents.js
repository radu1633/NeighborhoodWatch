import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_POSTS_BASE = `${Constants.expoConfig.extra.API_URL}/api/incidents`;
const API_MEDIA_BASE = `${Constants.expoConfig.extra.API_URL}/api/media`;

export const createIncident = async (data) => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${API_POSTS_BASE}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create incident");
  }

  return response.text();
};

export const postMedia = async (result, incidentId) => {
  const token = await AsyncStorage.getItem("token");

  const mediaUri = result.uri;
  const filename = mediaUri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename);
  const extension = match ? match[1].toLowerCase() : "";

  const type =
    extension.startsWith("mp4") || extension.startsWith("mov")
      ? `video/${extension}`
      : `image/${extension}`;

  const formData = new FormData();
  formData.append("file", {
    uri: mediaUri,
    name: filename,
    type: type,
  });

  const response = await fetch(`${API_MEDIA_BASE}?incidentId=${incidentId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload media");
  }

  return response.text();
};

export const deleteMediaFile = async (incidentId, fullPath) => {
  const token = await AsyncStorage.getItem("token");

  const url = new URL(`${API_MEDIA_BASE}`);
  url.searchParams.append("incidentId", incidentId);
  url.searchParams.append("path", fullPath);

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Eroare la ștergerea fișierului media.");
  }
};

export const getIncidentsByNeighborhood = async (neighborhoodId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(
    `${API_POSTS_BASE}/neighborhood/${neighborhoodId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch incidents");
  }
  const data = await response.json();
  return data;
};

export const getIncidentsByNeighborhoodPaginated = async (
  neighborhoodId,
  page,
  size
) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(
    `${API_POSTS_BASE}/neighborhood?neighborhoodId=${neighborhoodId}&page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch paginated incidents");

  return response.json();
};

export const getIncidentByUser = async (userId, neighborhoodId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(
    `${API_POSTS_BASE}/user-neighborhood?userId=${userId}&neighborhoodId=${neighborhoodId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch incidents");
  }
  const data = await response.json();
  // for (let i = 0; i < data.length; i++) {
  //   const d = data[i];
  //   console.log(d);
  //   console.log("\n");
  // }
  return data;
};

export const deleteIncident = async (incidentId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_POSTS_BASE}/${incidentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete incident");
  }

  return response.text();
};

export const updateIncident = async (incidentId, updatedData) => {
  const token = await AsyncStorage.getItem("token");
  const res = await fetch(`${API_POSTS_BASE}/${incidentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    throw new Error("Eroare la actualizarea incidentului.");
  }
};

export const getIncident = async (incidentId) => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_POSTS_BASE}/${incidentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null; // Or throw an error if you prefer
  }

  return response.json();
};
