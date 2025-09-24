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
import { getContactNumber } from "@/lib/contacts";

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

  // 🔄 Mută în afara lui useFocusEffect
  const fetchPosts = async (userId, neighborhoodId) => {
    try {
      const data = await getIncidentByUser(userId, neighborhoodId);
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const user = await getCurrentUser();
          setUser(user);
          await fetchPosts(user.id, user.neighborhoodId); // 👈 Adaugă aici
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };

      const fetchCount = async () => {
        try {
          const number = await getContactNumber();
          setCount(number);
        } catch (error) {
          console.error("Failed to load contact number:", error);
        }
      };

      fetchUser();
      fetchCount();
    }, [])
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-row justify-between items-center pb-4 mt-6">
        <Text className="text-white font-jsRegular text-2xl ml-4">Profil</Text>
        <TouchableOpacity
          onPress={() => router.replace("/(other)/profile_more")}
        >
          {/* () => setMoreVisible(true) */}
          <Image
            source={icons.more}
            className="w-9 h-9 mr-4"
            tintColor="white"
          />
        </TouchableOpacity>
      </View>
      <View className="items-center h-[30%] border-b border-white">
        <View className="items-center mt-4">
          {user && (
            <Image
              source={
                user.profilePhoto ? { uri: user.profilePhoto } : icons.anonymous
              }
              className="w-[100px] h-[100px] rounded-full"
            />
          )}

          <View className="flex-row gap-x-[10px] mt-3">
            {user?.firstName && (
              <Text className="text-2xl text-white font-jsSemiBold">
                {user.firstName}
              </Text>
            )}
            {user?.lastName && (
              <Text className="text-2xl text-white font-jsSemiBold">
                {user.lastName}
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post
            {...item}
            source="profile"
            onRefreshPosts={() => fetchPosts(user.id, user.neighborhoodId)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 80 : 70,
          paddingTop: 8,
        }}
        ListEmptyComponent={() => (
          <EmptyState
            title="Nu ai postări"
            subtitle="Adaugă o postare nouă pentru a o vizualiza aici."
          />
        )}
      />
      {/* </View> */}

      <MoreSection
        isVisible={isMoreVisible}
        onClose={() => setMoreVisible(false)}
      />
    </SafeAreaView>
  );
};

export default profile;
