import ProfileImage from "@/assets/john_doe.jpg";
import carImage from "@/assets/car_image.jpg";
import johnDoe from "@/assets/john_doe.jpg";
import { icons } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_BASE = `${Constants.expoConfig.extra.API_URL}`;

export const getAllCategories = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${API_BASE}/api/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();

    return data.map((category) => ({
      id: category.id,
      name: category.categoryName,
      image: `${API_BASE}${category.icon}`,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
