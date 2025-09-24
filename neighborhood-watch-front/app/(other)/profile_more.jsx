import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import { icons } from "@/constants";
import { logout } from "@/lib/auth";
import { useGlobalContext } from "@/context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { router, useNavigation } from "expo-router";
import EditProfileCard from "@/components/EditProfileCard";
import SelectAdmin from "@/components/SelectAdmin";
import {
  changeAdmin,
  exitNeighborhood,
  getNeighborhoodCode,
  deleteNeighborhood,
} from "@/lib/neighborhood";

const profile_more = () => {
  const { user, setUser, setIsLoggedIn, setNeighborhood } = useGlobalContext();
  const [code, setCode] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isSelectAdminVisible, setSelectAdminVisible] = useState(false);

  // useEffect(() => {
  //   const fetchCode = async () => {
  //     try {
  //       const data = await getNeighborhoodCode();
  //       setCode(data);
  //     } catch (error) {
  //       console.error("Failed to fetch neighborhood code:", error);
  //     }
  //   };
  //   fetchCode();
  // }, []);

  const signOut = async () => {
    await logout();
    setIsLoggedIn(false);
    setUser(null);
    console.log(user);
  };

  const handleChangeAdmin = async (selectedUser) => {
    try {
      console.log("Selected user:", selectedUser);
      await changeAdmin(selectedUser.userId);
      setUser((prevUser) => ({ ...prevUser, admin: false }));
    } catch (error) {
      console.error("Failed to change admin:", error);
    }
  };

  const handleExitNeighborhood = async () => {
    try {
      await exitNeighborhood();
      setNeighborhood(false);
      setUser((prevUser) => ({ ...prevUser, neighborhood: null }));
      router.push("/(auth)/neighborhood");
    } catch (error) {
      console.error("Failed to exit neighborhood:", error);
    }
  };

  const handleDeleteNeighborhood = async () => {
    try {
      await deleteNeighborhood(user.neighborhoodId);
      setNeighborhood(false);
      setUser((prevUser) => ({ ...prevUser, neighborhood: null }));
      router.push("/(auth)/neighborhood");
    } catch (error) {
      console.error("Failed to delete neighborhood:", error);
    }
  };

  return (
    <View className="bg-primary h-full flex-1">
      <View className="h-[13%] bg-secondary items-center justify-center flex-row">
        <TouchableOpacity
          className="absolute left-5 mt-[13%]"
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Image source={icons.cancel} className="w-12 h-12" />
        </TouchableOpacity>
      </View>

      {/* <View className="h-1/3 items-center">
        <Text className="text-white font-jsSemiBold mt-8 text-xl mb-7">
          Neighborhood code
        </Text>
        <View className="border border-customGreen border-2 rounded-full w-[80%] h-[50%] items-center justify-center">
          <Text className="text-white font-jsRegular mt-2 text-7xl">
            {code}
          </Text>
        </View>
      </View> */}
      <View className="flex-1 pt-5 ml-4 mr-4">
        <TouchableOpacity
          className="w-full py-3 border-b border-gray-600 flex-row gap-9"
          onPress={() => setEditModalVisible(true)}
        >
          <Image source={icons.edit} tintColor="white" className="w-8 h-8" />
          <Text className="text-white text-xl font-jsRegular">
            Editează profil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full py-3 border-b border-gray-600 flex-row gap-9"
          onPress={() => handleExitNeighborhood()}
        >
          <Image source={icons.change} tintColor="white" className="w-8 h-8" />
          <Text className="text-white text-xl self-center font-jsRegular">
            Ieși din cartier
          </Text>
        </TouchableOpacity>

        {/* {user?.admin && (
          <TouchableOpacity
            className="w-full py-3 border-b border-gray-600 flex-row gap-9"
            onPress={() => handleDeleteNeighborhood()}
          >
            <Image
              source={icons.cancel}
              tintColor="white"
              className="w-8 h-8"
            />
            <Text className="text-white text-xl self-center font-jsRegular">
              Șterge cartier
            </Text>
          </TouchableOpacity>
        )} */}

        {/* {user?.admin && (
          <TouchableOpacity
            className="w-full py-3 border-b border-gray-600 flex-row gap-9"
            onPress={() => setSelectAdminVisible(true)}
          >
            <Image
              source={icons.choose}
              tintColor="white"
              className="w-8 h-8"
            />
            <Text className="text-white text-xl self-center font-jsRegular">
              Alege admin
            </Text>
          </TouchableOpacity>
        )} */}

        <TouchableOpacity
          className="w-full py-3 border-b border-gray-600 flex-row gap-9"
          onPress={signOut}
        >
          <Image source={icons.logout} tintColor="white" className="w-8 h-8" />
          <Text className="text-white text-xl self-center font-jsRegular">
            Deconectare
          </Text>
        </TouchableOpacity>
      </View>

      <EditProfileCard
        user={user}
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={(updatedUser) => {
          setUser(updatedUser);
          setEditModalVisible(false);
        }}
      />

      {/* <SelectAdmin
        visible={isSelectAdminVisible}
        onClose={() => setSelectAdminVisible(false)}
        onSelectAdmin={(selectedUser) => {
          handleChangeAdmin(selectedUser);
          setSelectAdminVisible(false);
        }}
      /> */}
    </View>
  );
};

export default profile_more;
