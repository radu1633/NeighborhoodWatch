import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import CustomButton from "./CustomButton";
import FormField from "./FormField";
import { icons } from "@/constants";
import * as ImagePicker from "expo-image-picker";
import { updateUser, updateUserImage } from "@/lib/user";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileEditCard = ({ user, visible, onClose, onSave }) => {
  const [form, setForm] = useState({
    image: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        image: user.profilePhoto || null,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
      });
    }
  }, [user, visible]);

  const handleChange = (field, value) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const pickImage = async () => {
    // Cere permisiune
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permisiunea pentru accesarea galeriei este necesară!");
      return;
    }

    // Deschide galeria
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Rezultatul selecției imaginii:", result);

    // Dacă utilizatorul a selectat o imagine
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      console.log("Imagine selectată:", uri);
      setForm((prev) => ({ ...prev, image: uri }));
    }
  };

  return (
    // <Modal visible={visible} animationType="slide" transparent className="">
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.8}
      style={{
        margin: 0,
        justifyContent: "flex-end",
      }}
    >
      <SafeAreaView className="bg-secondary p-4 rounded-t-3xl h-[100%] items-center w-full">
        {/* <View className="w-full h-[700px] bg-primary p-6 rounded-2xl items-center"> */}
        <View className="w-12 h-1.5 bg-gray-400 rounded-full self-center mb-3" />
        <Text className="text-white text-xl font-jsSemiBold mb-4">
          Editează Profil
        </Text>
        <ScrollView className="w-full">
          <View className="w-full h-[780px] bg-primary p-6 rounded-2xl items-center">
            <View className="h-[100px] w-[100px]">
              <Image
                source={form.image ? { uri: form.image } : icons.anonymous}
                className="w-[100px] h-[100px] rounded-full"
              />
            </View>
            <CustomButton
              title="Schimbă imaginea"
              handlePress={pickImage}
              image={icons.camera}
              imageStyles={"w-[25px] h-[25px] "}
              containerStyles={"w-[190px] mt-7 bg-customGreen h-[40px]"}
              textStyles={"text-black"}
              tint="black"
            />
            <FormField
              title="Prenume"
              value={form.firstName}
              handleChangeText={(value) => handleChange("firstName", value)}
              otherStyles="mt-8"
            />
            <FormField
              title="Nume"
              value={form.lastName}
              handleChangeText={(value) => handleChange("lastName", value)}
              otherStyles="mt-5"
              keyboardType="email-address"
            />
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(value) => handleChange("email", value)}
              otherStyles="mt-5"
            />
            <FormField
              title="Telefon"
              value={form.phone}
              handleChangeText={(value) => handleChange("phone", value)}
              otherStyles="mt-5"
            />
            <CustomButton
              title="Salvează"
              containerStyles={"bg-customGreen p-2 w-[200px] mt-8 h-[60px]"}
              handlePress={async () => {
                try {
                  if (form.image && form.image.startsWith("file://")) {
                    await updateUserImage({ assets: [{ uri: form.image }] });
                  }

                  const newUser = await updateUser({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    phoneNumber: form.phone,
                  });
                  console.log(newUser.profilePhoto);
                  onSave({
                    ...user,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    phoneNumber: form.phone,
                    profilePhoto: newUser.profilePhoto
                      ? `http://192.168.100.38:8080${newUser.profilePhoto}`
                      : null,
                  });
                } catch (err) {
                  console.error("Eroare la salvare:", err);
                }
              }}
              textStyles={"text-black"}
            />
            <CustomButton
              title="Renunță"
              containerStyles={"mt-7"}
              textStyles={"text-red-500"}
              handlePress={onClose}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default ProfileEditCard;
