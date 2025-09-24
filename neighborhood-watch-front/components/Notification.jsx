import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { icons } from "@/constants";
import { toggleEmergencyStatus } from "@/lib/contacts";
import { useRouter } from "expo-router";
import { useContactContext } from "@/context/ContactProvider";
import { formatRelativeTime } from "@/lib/formatDate";
import { markAsRead, deleteNotification } from "@/lib/notifications";

const Notification = ({
  id,
  title,
  message,
  read,
  type,
  timestamp,
  referenceId,
  fetchNotifications,
}) => {
  const router = useRouter();

  const navigateToPage = () => {
    console.log(referenceId);
    if (type === "INCIDENT_CREATED") {
      router.push({
        pathname: `(other)/post_page`,
        params: { incidentId: referenceId },
      });
    } else if (type === "CONTACT_CREATED") {
      router.push(`(tabs)/contacts`);
    } else if (type === "COMMENT_CREATED") {
      router.push({
        pathname: `(other)/post_page`,
        params: { incidentId: referenceId, showComments: "true" },
      });
    } else if (type === "MESSAGE_CREATED") {
      router.push("/(other)/chat");
    } else {
      Alert.alert("Notificare", "Tip de notificare necunoscut.");
    }

    markAsRead(id);
    fetchNotifications(); // ⬅️ refacem lista
  };

  const handleDelete = async () => {
    await deleteNotification(id);
    fetchNotifications(); // ⬅️ refacem lista
  };

  return (
    <Swipeable
      renderRightActions={() => (
        <View style={{ width: 1 }} /> // forțează activarea swipe-ului
      )}
      onSwipeableOpen={handleDelete}
    >
      <TouchableOpacity onPress={navigateToPage}>
        <View
          className={`p-4 rounded-3xl mb-3 mx-3 bg-opacity-80 ${
            read ? "bg-secondary" : "bg-secondary border border-customGreen"
          }`}
        >
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              {/* <Image
            source={image ? { uri: image } : icons.anonymous}
            className="w-[50px] h-[50px] rounded-full"
          /> */}
              <View className="ml-2">
                <Text className="text-white font-semibold text-lg">
                  {title}
                </Text>
                <View className="flex-row justify-between w-full mt-2">
                  <Text className="text-white">{message}</Text>
                  <Text className="text-white mr-1">
                    {formatRelativeTime(timestamp)}
                  </Text>
                </View>
              </View>
            </View>

            {/* <TouchableOpacity
          onPress={handleEmergencyContact}
          className="justify-center"
        >
          <Image
            className="w-[35px] h-[35px]"
            source={contactEmergency ? icons.emergencyPressed : icons.emergency}
          />
        </TouchableOpacity> */}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default Notification;
