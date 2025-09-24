import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // doar pentru inițializare dacă vrei
  const [neighborhood, setNeighborhood] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const userData = await getCurrentUser();
        console.log("User data:", userData);
        if (userData) {
          setUser(userData);
          setIsLoggedIn(true);
          setNeighborhood(userData.neighborhoodId);
        } else {
          await AsyncStorage.removeItem("token");
        }

        if (!userData.neighborhoodId) {
          router.replace("/neighborhood");
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        neighborhood,
        setNeighborhood,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
