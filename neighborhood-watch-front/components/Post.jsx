import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Linking,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants"; // Import local assets
import CommentSection from "./CommentSection";
import { formatRelativeTime } from "@/lib/formatDate";
import { Video } from "expo-av";
import { deleteIncident } from "@/lib/incidents";
import { router } from "expo-router";

const Post = ({
  source,
  onRefreshPosts,
  showComments = false,
  ...incident
}) => {
  const [isCommentsVisible, setIsCommentsVisible] = useState(showComments);

  const screenWidth = Dimensions.get("window").width;
  const isFromProfile = source === "profile";

  const isVideo = (uri) => {
    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv"];
    return videoExtensions.some((ext) => uri.toLowerCase().endsWith(ext));
  };

  const openMap = (lat, lon) => {
    const label = "Locație incident";
    const url =
      Platform.select({
        ios: `http://maps.apple.com/?ll=${lat},${lon}&q=${label}`,
        android: `geo:${lat},${lon}?q=${lat},${lon}(${label})`,
      }) || `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

    Linking.openURL(url);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteIncident(incident.id);
      if (response) {
        console.log("Incident șters cu succes");
        onRefreshPosts?.(); // 🔁 Refresh postări
      } else {
        console.error("Eroare la ștergerea incidentului");
      }
    } catch (error) {
      console.error("Eroare la ștergerea incidentului:", error);
    }
  };

  return (
    <View className="bg-secondary p-4 rounded-3xl mb-4 mr-3 ml-3">
      {/* User Info */}
      <View className="flex-row justify-between">
        <View className="flex-row items-center">
          <Image
            source={
              incident.user.profilePhoto && incident.anonymous === false
                ? {
                    uri: `http://192.168.100.38:8080${incident.user.profilePhoto}`,
                  }
                : icons.anonymous
            }
            className="w-[40px] h-[40px] rounded-full"
          />
          <View className="ml-2">
            <Text className="text-white font-semibold">
              {incident.anonymous === true
                ? "Anonim"
                : incident.user.firstName + " " + incident.user.lastName}
            </Text>
            <Text className="text-gray-400 text-xs">
              {formatRelativeTime(incident.date)}
            </Text>
          </View>
        </View>
        <Text className="text-gray-400">{incident.categoryName}</Text>
      </View>

      <Text className="text-white mt-2">{incident.description}</Text>

      {incident.mediaUrls && incident.mediaUrls.length > 0 && (
        <FlatList
          className="w-full"
          data={incident.mediaUrls}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled // <- aliniere perfectă pe swipe
          decelerationRate="fast" // <- swipe instant
          showsHorizontalScrollIndicator={false}
          snapToInterval={screenWidth - 50} // <- fiecare item = lățimea ecranului
          snapToAlignment="start" // <- aliniere la început
          renderItem={({ item }) =>
            isVideo(item) ? (
              <Video
                source={{ uri: item }}
                useNativeControls
                resizeMode="cover"
                isLooping
                style={{
                  width: screenWidth - 50,
                  height: 240,
                  borderRadius: 5,
                  marginTop: 5,
                  marginRight: 1,
                }}
              />
            ) : (
              <Image
                source={{ uri: item }}
                style={{
                  width: screenWidth - 50,
                  height: 240,
                  borderRadius: 5,
                  marginTop: 5,
                  marginRight: 1,
                }}
                resizeMode="cover"
              />
            )
          }
        />
      )}
      <View className="flex-row items-center justify-between mt-3 w-full">
        <View className="flex-row items-center">
          {/* Locație */}
          {incident.locationLat > 0 && incident.locationLon > 0 && (
            <TouchableOpacity
              onPress={() =>
                openMap(incident.locationLat, incident.locationLon)
              }
              className="flex-row items-center mr-5"
            >
              <Image source={icons.location} className="w-8 h-8" />
              <Text className="text-gray-400 text-sm ml-1">Locație</Text>
            </TouchableOpacity>
          )}

          {/* Comentarii */}
          <View className="flex-row items-center mr-5">
            <TouchableOpacity onPress={() => setIsCommentsVisible(true)}>
              <Image source={icons.comm} className="w-8 h-8" />
            </TouchableOpacity>
            <Text className="text-gray-400 text-sm ml-1">Comentarii</Text>
          </View>
        </View>

        <View className="flex-row items-center">
          {/* Edit */}
          {isFromProfile && (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "(other)/edit_incident",
                  params: { incident: JSON.stringify(incident) }, // ⚠️ trebuie serializat
                })
              }
              className="mr-3"
            >
              <Image
                source={icons.edit}
                className="w-8 h-8"
                style={{ tintColor: "white" }}
              />
            </TouchableOpacity>
          )}

          {/* Delete */}
          {isFromProfile && (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Ștergere incident",
                  "Ești sigur că vrei să ștergi incidentul?",
                  [
                    { text: "Anulează", style: "cancel" },
                    {
                      text: "Șterge",
                      style: "destructive",
                      onPress: () => handleDelete(incident.id),
                    },
                  ]
                );
              }}
            >
              <Image source={icons.garbage} className="w-8 h-8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <CommentSection
        isVisible={isCommentsVisible}
        onClose={() => setIsCommentsVisible(false)}
        incidentId={incident.id}
      />
    </View>
  );
};

export default Post;
