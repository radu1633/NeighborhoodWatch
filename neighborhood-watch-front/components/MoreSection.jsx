import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import { icons } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "@/lib/auth";
import { useGlobalContext } from "@/context/GlobalProvider";

const MoreSection = ({ isVisible, onClose }) => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const signOut = async () => {
    await logout();
    setIsLoggedIn(false);
    setUser(null);
    console.log(user);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="up"
      onSwipeComplete={onClose}
      animationIn="slideInDown"
      animationOut="slideOutUp"
      backdropOpacity={0.8}
      style={{
        margin: 0,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        marginTop: Platform.OS === "ios" ? 70 : 23,
        marginRight: 10,
      }}
    >
      <View className="bg-secondary p-4 rounded-3xl h-[30%] w-[60%]">
        <View className="flex-grow">
          <TouchableOpacity
            className="w-full py-3 border-b border-gray-600 flex-row gap-9"
            //onPress={onEditProfile}
          >
            <Image source={icons.edit} tintColor="white" className="w-7 h-7" />
            <Text className="text-white text-lg font-jsRegular">
              Editează profil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-full py-3 border-b border-gray-600 flex-row gap-9">
            <Image
              source={icons.change}
              tintColor="white"
              className="w-7 h-7"
            />
            <Text className="text-white text-lg self-center font-jsRegular">
              Schimbă cartier
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full py-3 border-b border-gray-600 flex-row gap-9"
            onPress={signOut}
          >
            <Image
              source={icons.logout}
              tintColor="white"
              className="w-7 h-7"
            />
            <Text className="text-white text-lg self-center font-jsRegular">
              Deconectare
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-12 h-1.5 bg-gray-400 rounded-full self-center mt-auto mb-2" />
      </View>
    </Modal>
  );
};

export default MoreSection;
