import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPosts, getLoggedUserInfo } from "@/lib/backend";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { getUserPosts } from "@/lib/backend";
import Post from "@/components/Post";
import { getCurrentUser } from "@/lib/user";
import { getContactNumberById } from "@/lib/contacts";
import { useContactContext } from "@/context/ContactProvider";

import MoreSection from "@/components/MoreSection";
import { router } from "expo-router";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getIncidentByUser } from "@/lib/incidents";
import EmptyState from "@/components/EmptyState";

const profile = () => {
  const [user, setUser] = useState(null);
  const [isMoreVisible, setMoreVisible] = useState(false);
  const [count, setCount] = useState(null);
  const [posts, setPosts] = useState(null);
  const { selectedContact } = useContactContext();

  useEffect(() => {
    if (selectedContact) {
      setUser(selectedContact);
      console.log("Selected contact:", selectedContact);
      // poți afisa: selectedContact.name, .phone etc.
      const fetchPosts = async () => {
        try {
          const data = await getIncidentByUser(
            selectedContact.userId,
            selectedContact.neighborhoodId
          );
          console.log("Fetched posts:", data[0]);

          const filtered = data.filter((post) => post.anonymous !== true);

          setPosts(filtered);
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        }
      };

      const fetchCount = async () => {
        try {
          const number = await getContactNumberById(selectedContact.userId);
          setCount(number);
        } catch (error) {
          console.error("Failed to load contact number:", error);
        }
      };

      fetchPosts();
      fetchCount();
    }
  }, []);

  return (
    <View className="bg-primary h-full flex-1">
      <View className="h-[13%] bg-secondary items-center justify-center flex-row">
        <TouchableOpacity
          className="absolute left-5 mt-[13%]"
          onPress={() => router.back()}
        >
          <Image source={icons.cancel} className="w-12 h-12" />
        </TouchableOpacity>
      </View>
      <View className="items-center h-[30%] border-b border-white">
        <View className="items-center mt-4">
          {user && (
            <Image
              source={user.image ? { uri: user.image } : icons.anonymous}
              className="w-[100px] h-[100px] rounded-full"
            />
          )}

          <View className="flex-row gap-x-[10px] mt-3">
            {user?.name && (
              <Text className="text-2xl text-white font-jsSemiBold">
                {user.name}
              </Text>
            )}
          </View>
          <View className="flex-row items-center gap-x-[60px] pt-5">
            <View className="items-center">
              <Text className="text-2xl font-jsSemiBold text-white">
                Contacte
              </Text>
              <Text className="text-xl font-jsRegular text-white">
                {count !== null ? count : "Se încarcă..."}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-jsSemiBold text-white">
                Postări
              </Text>
              <Text className="text-xl font-jsRegular text-white">
                {posts !== null ? posts.length : "Se încarcă..."}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* <View className="items-center mt-5"> */}
      <FlatList
        data={posts}
        //data={[]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Post {...item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 80 : 70,
          paddingTop: 8,
        }}
        ListEmptyComponent={() => (
          <EmptyState title="Nu sunt incidente de afișat" />
        )}
      />
      {/* </View> */}

      <MoreSection
        isVisible={isMoreVisible}
        onClose={() => setMoreVisible(false)}
      />
    </View>
  );
};

export default profile;
