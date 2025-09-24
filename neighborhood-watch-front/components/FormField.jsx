import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import "../global.css";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  textStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-jsMedium mb-2">
        {title}
      </Text>
      <View
        className={`border-2 w-full h-16 px-4 bg-[#2a2a2a] rounded-2xl items-center flex-row ${
          isFocused ? "border-[#C4E76F]" : "border-gray-500"
        }`}
      >
        <TextInput
          className={` flex-1 text-white font-psemibold ${textStyles}`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={
            (title === "Parolă" || title === "Confirmare parolă") &&
            !showPassword
          }
          onFocus={() => setIsFocused(true)} // When input is focused
          onBlur={() => setIsFocused(false)} // When input loses focus
        />

        {(title === "Parolă" || title === "Confirmare parolă") && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, lef: 10, right: 10 }}
          >
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
