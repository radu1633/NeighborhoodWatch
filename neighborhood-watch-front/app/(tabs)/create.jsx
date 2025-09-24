import {
  View,
  Text,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { router, useNavigation } from "expo-router";
import { getLoggedUserInfo } from "@/lib/backend";
import * as ImagePicker from "expo-image-picker";
import { openCamera, deletePhoto } from "@/lib/cameraUtils";
import CategorySection from "@/components/CategorySection";
import { Video } from "expo-av";
import { getCurrentLocation } from "@/lib/location";
import { gallery } from "@/lib/galleryUtils";
import { createIncident, postMedia } from "@/lib/incidents";
import { getCurrentUser } from "@/lib/user";
import { useGlobalContext } from "@/context/GlobalProvider";

const create = () => {
  const { user } = useGlobalContext();

  const navigation = useNavigation();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLocation, setIsLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaSize, setMediaSize] = useState({ width: "100%", height: "300" });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const resetForm = () => {
    setDescription("");
    setSelectedMedia([]);
    setSelectedCategory(null);
    setIsAnonymous(false);
    setIsLocation(false);
    setLocation(null);
  };

  const handleImagePicker = async () => {
    await gallery(setSelectedMedia);
  };

  const handleLocationPress = async () => {
    if (isLocation) {
      setIsLocation(false); // Resetează stilul butonului
      setLocation(null); // Resetează locația
      return;
    }

    const coords = await getCurrentLocation();
    if (coords) {
      setLocation(coords); // Salvează locația într-un state
      console.log("Locație:", coords); // Afișează coordonatele în consolă
      setIsLocation(true); // Schimbă stilul butonului
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Te rugăm să adaugi o descriere.");
      return;
    }

    if (!selectedCategory) {
      alert("Te rugăm să selectezi o categorie.");
      return;
    }

    try {
      // Creează obiectul cu datele incidentului
      const incidentData = {
        description,
        category_id: selectedCategory,
        locationLat: location?.latitude || 0,
        locationLon: location?.longitude || 0,
        neighborhoodId: user.neighborhoodId,
        anonymous: isAnonymous,
      };

      console.log("Incident Data:", incidentData);

      // Creează incidentul
      var incidentId = await createIncident(incidentData);
      console.log("Incident creat:", incidentId);

      // Postează fișierele media, dacă există
      if (selectedMedia.length > 0) {
        for (const media of selectedMedia) {
          await postMedia(media, incidentId);
        }
      }

      // Resetare stare / navigare
      alert("Incident postat cu succes!");
      resetForm();
      router.push("/home");
    } catch (error) {
      console.error("Eroare la postare:", error);
      alert("A apărut o eroare la postare.");
    }
  };

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView className="bg-secondary h-full flex-1">
      <View className="flex-row justify-between items-center pb-4 pt-3 bg-secondary">
        <View className="flex-row">
          <CustomButton
            image={icons.cancel}
            handlePress={() => {
              resetForm();
              router.push("/home");
            }}
            containerStyles={"h-[30px] mt-3"}
            textStyles={"text-black"}
          />
          <Text className="text-white font-jsRegular text-2xl mt-3">
            Creează
          </Text>
        </View>

        <CustomButton
          title="Postează"
          handlePress={handleSubmit}
          containerStyles={"w-[100px] bg-customGreen h-[30px] mt-4 mr-4"}
          textStyles={"text-black text-lg"}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1 w-full bg-primary"
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled={true}
        scrollEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* <FlatList
          className="flex-1 w-full bg-primary"
          data={[{ key: "content" }]} // Dummy data to make FlatList behave like a ScrollView
          keyExtractor={(item) => item.key}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          renderItem={() => (
            <> */}
        {/* User Info */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="bg-primary pt-5 flex-row items-center">
            {user?.profilePhoto && (
              <Image
                source={{ uri: user.profilePhoto }}
                className="w-[50px] h-[50px] rounded-full ml-3"
              />
            )}
            {user?.firstName && (
              <Text className="text-2xl text-white font-jsSemiBold ml-5">
                {user.firstName}
              </Text>
            )}
            {user?.lastName && (
              <Text className="text-2xl text-white font-jsSemiBold ml-1">
                {user.lastName}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>

        {/* Anonymous & Location Buttons */}
        <View className="bg-primary pt-5 pb-5 flex-row items-center">
          <CustomButton
            image={icons.anonymous_2}
            imageStyles={"w-[25px] h-[25px]"}
            title="Anonim"
            handlePress={() => setIsAnonymous(!isAnonymous)}
            containerStyles={`w-[130px] h-[35px] mr-2 ml-3 ${
              isAnonymous ? "bg-customGreen" : "bg-secondary"
            }`}
            textStyles={"text-white"}
          />

          <CustomButton
            image={icons.location}
            imageStyles={"w-[25px] h-[25px]"}
            title="Locație"
            handlePress={handleLocationPress}
            containerStyles={`w-[130px] h-[35px] mr-4 ml-3 ${
              isLocation ? "bg-customGreen" : "bg-secondary"
            }`}
            textStyles={"text-white"}
          />
        </View>

        {/* Category Section */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <CategorySection
            selectedCategoryId={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </TouchableWithoutFeedback>

        {/* Description Box */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-row items-center mt-5 mb-3">
            <Image
              source={icons.page}
              className="w-7 h-7 ml-3"
              tintColor="white"
            />
            <Text className="text-white text-lg font-jsSemiBold ml-1">
              Descriere
            </Text>
          </View>
        </TouchableWithoutFeedback>

        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss()}> */}
        <View className="bg-secondary min-h-[200px] w-[95%] p-4 border border-gray-400 rounded-2xl self-center mb-8">
          <TextInput
            placeholder="Descrie problema..."
            placeholderTextColor="gray"
            value={description}
            onChangeText={setDescription}
            multiline
            style={{ minHeight: 100, textAlignVertical: "top" }}
            className="text-white text-m font-jsRegular w-full min-h-[200px]"
          />
        </View>
        {/* </TouchableWithoutFeedback> */}

        {selectedMedia.length > 0 && (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="w-[95%] bg-primary border border-gray-400 rounded-2xl self-center items-center p-2">
              {selectedMedia.map((media, index) => (
                <TouchableWithoutFeedback
                  key={`${media.uri}-${index}`}
                  onPress={Keyboard.dismiss}
                >
                  <View
                    key={index}
                    className="relative mb-3 items-center justify-center"
                    style={{
                      width: mediaSize.width,
                      height: mediaSize.height,
                    }}
                  >
                    {media.type === "video" ? (
                      <Video
                        source={{ uri: media.uri }}
                        useNativeControls
                        resizeMode="cover"
                        style={{
                          width: mediaSize.width,
                          height: mediaSize.height,
                          borderRadius: 12,
                        }}
                      />
                    ) : (
                      <Image
                        source={{ uri: media.uri }}
                        className="rounded-2xl"
                        style={{
                          width: mediaSize.width,
                          height: mediaSize.height,
                        }}
                        resizeMode="cover"
                      />
                    )}

                    <View className="absolute top-[-15] right-[-10px] z-10">
                      <CustomButton
                        image={icons.cancel}
                        imageStyles="w-[27px] h-[27px] ml-3"
                        handlePress={() =>
                          setSelectedMedia((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        containerStyles="bg-red-600 w-[40px] h-[40px] rounded-full"
                        textStyles="text-white"
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
          </TouchableWithoutFeedback>
        )}

        {/* Add spacing so the bottom section doesn’t overlap */}
        <View className="h-32" />
        {/* </>
          )}
        /> */}
      </ScrollView>

      <View className="bg-secondary w-full rounded-t-[30px] -mt-8 px-4 py-5">
        <CustomButton
          image={icons.photo}
          imageStyles={"w-[40px] h-[40px]"}
          title="Poză/Video"
          containerStyles={"h-[30px] mt-4 self-start"}
          textStyles={"text-white text-xl"}
          handlePress={() => handleImagePicker()}
        />
        <CustomButton
          image={icons.camera}
          imageStyles={"w-[40px] h-[40px]"}
          title="Cameră"
          containerStyles={"h-[30px] mt-7 self-start"}
          textStyles={"text-white text-xl"}
          handlePress={() => openCamera(setSelectedMedia, setMediaSize)}
        />
      </View>
    </SafeAreaView>
    // </TouchableWithoutFeedback>
  );
};

export default create;
