import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_BASE = `${Constants.expoConfig.extra.API_URL}/api/cities`;

export const getRomanianCities = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await fetch(`${API_BASE}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  const cities = data.map((city) => ({
    key: city.id,
    label: city.name,
    value: city.id,
  }));

  return cities;
};
