import { View, Text, Image, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { icons } from "@/constants";
import { getAllCategories } from "@/lib/backend";
import Category from "./Category";

const CategorySection = ({ selectedCategoryId, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);

  return (
    <View>
      <View className="flex-row items-center ml-3">
        <Image source={icons.category} className="w-7 h-7" />
        <Text className="text-white text-lg font-jsSemiBold ml-1">
          Alege categorie
        </Text>
      </View>
      <FlatList
        className="mt-3"
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Category
            {...item}
            selected={item.id === selectedCategoryId}
            onPress={() => onSelectCategory(item.id)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default CategorySection;
