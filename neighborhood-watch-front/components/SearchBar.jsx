import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { icons } from "../constants";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;

const SearchBar = ({ searchText, setSearchText, onSearchToggle }) => {
  const animation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width:
        animation.value === 1
          ? withTiming(SCREEN_WIDTH - 20, { duration: 300 })
          : withTiming(0, { duration: 300 }),
      transform: [
        {
          translateX:
            animation.value === 1
              ? withTiming(-60, { duration: 300 })
              : withTiming(0, { duration: 300 }),
        },
      ],
    };
  });

  const toggleSearch = () => {
    if (animation.value === 1) {
      animation.value = 0;
      onSearchToggle(false); // Închide + notifică părinte
    } else {
      animation.value = 1;
      onSearchToggle(true); // Deschide + notifică părinte
    }
  };

  return (
    <View className="flex-1 justify-center items-center ml-[120px]">
      <Animated.View
        className="w-[365px] h-[40px] bg-secondary rounded-3xl flex-row items-center"
        style={animatedStyle}
      >
        <TextInput
          className="ml-4 w-[83%] text-white"
          placeholder="Caută vecin..."
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity className="px-4" onPress={toggleSearch}>
          <Image
            source={animation.value === 0 ? icons.search : icons.cancel}
            className="w-10 h-10"
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SearchBar;
