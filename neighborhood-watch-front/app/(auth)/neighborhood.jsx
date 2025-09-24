import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image as RNImage,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import "@/global.css";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Picker } from "@react-native-picker/picker";
import { useGlobalContext } from "@/context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRomanianCities } from "@/lib/cities";
import { createNeighborhood, enterNeighborhood } from "@/lib/neighborhood";
import { logout } from "@/lib/auth";
import { getCurrentUser } from "@/lib/user";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { submitImageForOCR } from "@/lib/neighborhood";

const Neighborhood = () => {
  const { setNeighborhood, setUser, user, setIsLoggedIn } = useGlobalContext();

  const [neighborhoodForm, setNeighborhoodForm] = useState({ code: "" });
  const [createNeighborhoodForm, setCreateNeighborhoodForm] = useState({
    name: "",
    cityId: null,
  });
  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const submitImage = async () => {
    if (!selectedImage) {
      Alert.alert("Eroare", "Selectează mai întâi o imagine!");
      return;
    }

    setIsImageUploading(true);

    try {
      const result = await submitImageForOCR(selectedImage);

      if (result.cartier === "necunoscut") {
        Alert.alert(
          "Cartier necunoscut",
          "Adresa nu aparține unui cartier recunoscut."
        );
      } else {
        Alert.alert(
          "Succes",
          `Adresa detectată aparține cartierului: ${result.name}`
        );
      }

      const updatedUser = await getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
        setNeighborhood(updatedUser.neighborhoodId);
        setIsLoggedIn(true);
        router.replace("/home");
      }
    } catch (err) {
      console.error("Eroare OCR:", err);
      Alert.alert("Eroare", "Nu s-a putut trimite imaginea.");
    } finally {
      setIsImageUploading(false);
    }
  };

  if (isImageUploading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#C4E76F" />
        <Text className="text-white text-lg mt-4">
          Se procesează imaginea...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 h-full">
      <View className="bg-black h-1/3 w-full items-center justify-center">
        <Text className="text-white text-xl font-jsRegular">
          bine ai venit la...
        </Text>
        <Text className="text-white text-[30px] font-jsBold">Neighborhood</Text>
        <Text className="text-white text-[30px] font-jsBold mt-1">Watch</Text>
      </View>

      <View className="bg-primary rounded-t-[30px] -mt-8 px-6 py-10 flex-1 items-center w-full">
        <KeyboardAwareScrollView
          enableOnAndroid
          className="w-full"
          showsVerticalScrollIndicator={false}
        >
          <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
            {/* Intrare în cartier */}
            <Text className="text-3xl text-white font-jsSemiBold self-center ml-1">
              Intră într-un cartier
            </Text>

            {/* Upload buletin OCR */}
            <View className="mt-10 items-center">
              <Text className="text-white font-jsSemiBold text-xl mb-2 text-center">
                Încarcă buletinul pentru ca aplicația să îți recunoască
                domiciliul și să te adauge automat în cartierul corect
              </Text>
              <TouchableOpacity onPress={pickImage}>
                <View className="bg-white w-[280px] h-[180px] rounded-xl justify-center items-center mt-5">
                  {selectedImage ? (
                    <RNImage
                      className="w-[280px] h-[180px] rounded-lg bg-black"
                      source={{ uri: selectedImage.uri }}
                    />
                  ) : (
                    <Text className="text-black text-center">
                      Selectează Imagine
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <CustomButton
                title="Trimite imagine"
                handlePress={submitImage}
                containerStyles="w-[200px] h-[50px] mt-5 bg-[#C4E76F]"
                textStyles="text-black text-lg"
                disabled={!selectedImage}
              />
            </View>

            {/* Deconectare */}
            <CustomButton
              title="Deconectare"
              handlePress={() => logout()}
              containerStyles="w-[200px] h-[50px] mt-5 bg-[#C4E76F] self-center"
              textStyles="text-black text-xl"
            />
          </ScrollView>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default Neighborhood;
