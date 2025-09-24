import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { icons } from "@/constants";
import { toggleEmergencyStatus } from "@/lib/contacts";
import { useRouter } from "expo-router";
import { useContactContext } from "@/context/ContactProvider";

const Contact = ({
  id,
  name,
  email,
  phone,
  image,
  neighborhoodId,
  emergency,
  userId,
}) => {
  const [contactEmergency, setContactEmergency] = useState(emergency);
  const router = useRouter();
  const { setSelectedContact } = useContactContext();

  const handleEmergencyContact = async () => {
    try {
      const newStatus = !contactEmergency;
      setContactEmergency(newStatus);
      await toggleEmergencyStatus(id, newStatus);
    } catch (error) {
      console.error("Eroare la actualizarea contactului:", error);
      setContactEmergency((prev) => !prev);
    }
  };

  const openProfile = () => {
    setSelectedContact({
      id,
      name,
      email,
      phone,
      image,
      neighborhoodId,
      emergency,
      userId,
    });
    router.push("/(other)/other_profile");
  };

  const callPhone = () => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderRightActions = () => (
    <View className="flex-row items-center mr-3 space-x-2">
      <TouchableOpacity
        onPress={openProfile}
        className="bg-customGreen px-4 py-3 rounded-xl mr-2 h-[38px] w-[60px]"
      >
        <Text className="text-black font-bold text-center">Profil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={callPhone}
        className="bg-customGreen px-4 py-3 rounded-xl h-[38px]"
      >
        <Text className="text-black font-bold">Apelează</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View className="bg-secondary bg-opacity-80 p-4 rounded-3xl mb-3 mx-3">
        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <Image
              source={image ? { uri: image } : icons.anonymous}
              className="w-[50px] h-[50px] rounded-full"
            />
            <View className="ml-2">
              <Text className="text-white font-semibold text-xl">{name}</Text>
              <Text className="text-white text-lg">{phone}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleEmergencyContact}
            className="justify-center"
          >
            <Image
              className="w-[35px] h-[35px]"
              source={
                contactEmergency ? icons.emergencyPressed : icons.emergency
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );
};

export default Contact;
