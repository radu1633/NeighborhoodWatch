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
import { router, useLocalSearchParams } from "expo-router";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getIncidentByUser, getIncident } from "@/lib/incidents";
import EmptyState from "@/components/EmptyState";

const profile = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // <- Nou
  const { incidentId, showComments } = useLocalSearchParams();

  useEffect(() => {
    fetchIncident();
  }, []);

  const fetchIncident = async () => {
    try {
      const data = await getIncident(incidentId);
      setPost(data);
    } catch (error) {
      console.error("Failed to fetch incident:", error);
    } finally {
      setLoading(false); // <- Indică faptul că fetch-ul s-a terminat
    }
  };

  return (
    <View className="bg-primary h-full flex-1">
      <View className="h-[13%] bg-secondary items-center justify-center flex-row">
        <TouchableOpacity
          className="absolute left-5 mt-[13%]"
          onPress={() => router.push("/(tabs)/home")}
        >
          <Image source={icons.cancel} className="w-12 h-12" />
        </TouchableOpacity>
      </View>

      <View className="mt-5">
        {loading ? (
          <Text className="text-white text-center mt-10">Se încarcă...</Text>
        ) : post ? (
          <Post {...post} showComments={showComments === "true"} />
        ) : (
          <Text className="text-white text-center mt-10">
            Incidentul nu mai există.
          </Text>
        )}
      </View>
    </View>
  );
};
export default profile;
