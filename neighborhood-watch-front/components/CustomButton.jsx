import { TouchableOpacity, View, Text, Image } from "react-native";
import React from "react";
import "../global.css";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  image,
  imageStyles,
  tint,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`rounded-full flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      {image && (
        <Image
          source={image}
          className={imageStyles}
          resizeMode="contain"
          tintColor={tint}
        />
      )}
      <Text className={`font-jsBold ${textStyles}`}> {title} </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
