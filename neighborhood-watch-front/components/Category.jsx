import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const Category = ({ name, image, selected, onPress }) => {
  return (
    <View className="ml-5 items-center">
      <TouchableOpacity
        onPress={onPress}
        className={`mb-2 w-18 h-18 rounded-full p-2 ${
          selected ? "bg-customGreen" : "bg-secondary"
        }`}
      >
        <Image source={{ uri: image }} className="w-10 h-10" />
      </TouchableOpacity>
      {name.split(" ").map((word, index) => (
        <Text key={index} className="text-white text-md font-jsRegular">
          {word}
        </Text>
      ))}
    </View>
  );
};

export default Category;
