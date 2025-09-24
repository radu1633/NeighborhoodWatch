import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "../constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="flex justify-center items-center px-4 gap-2">
      <Image
        source={icons.empty}
        className="w-[270px] h-[215px] mt-[100px]"
        resizeMode="contain"
        //style={{ tintColor: "white" }}
      />
      <Text className="text-2xl text-center font-jsSemiBold text-white mt-2">
        {title}
      </Text>
      <Text className="font-jsMedium text-sm text-gray-100">{subtitle}</Text>

      {/* <CustomButton
        title="Creează incident"
        handlePress={() => router.push("/(tabs)/create")}
        containerStyles={"w-[150px] h-[62px] my-5 bg-[#C4E76F] self-center"}
      /> */}
    </View>
  );
};

export default EmptyState;
