import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { Redirect, router } from "expo-router";
import "../global.css";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import Neighborhood from "./(auth)/neighborhood";

export default function App() {
  const { isLoading, isLoggedIn, neighborhood } = useGlobalContext();

  if (!isLoading && isLoggedIn && !neighborhood)
    return <Redirect href="/neighborhood" />;
  else if (!isLoading && isLoggedIn && neighborhood)
    return <Redirect href="/home" />;

  return (
    <View className="flex-1">
      <View className="bg-black h-1/3 w-full items-center justify-center">
        <Text className="text-white text-xl font-jsRegular ">
          bine ai venit la...
        </Text>
        <Text className="text-white text-[30px] font-jsBold">Neighborhood</Text>
        <Text className="text-white text-[30px] font-jsBold mt-1">Watch</Text>
      </View>
      <View className="bg-primary rounded-t-[30px] -mt-8 px-6 py-10 flex-1 justify-center items-center w-full">
        <Image
          source={images.onBoarding}
          className="w-[300px] h-[300px] mb-7"
          resizeMode="contain"
        />

        <Text className="text-2xl font-jsBold text-center text-white mt-2">
          Stai informat și garantează siguranța cartierului tău
        </Text>

        <CustomButton
          title="Începe"
          handlePress={() => {
            router.push("/(auth)/sign-in"); // Instantly navigates to index.jsx
          }}
          containerStyles={"w-[300px] h-[62px] mt-7 bg-customGreen"}
          textStyles={"text-black text-xl"}
        />
      </View>
    </View>
  );
}
