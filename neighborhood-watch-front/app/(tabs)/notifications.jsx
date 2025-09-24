import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";
import EmptyState from "@/components/EmptyState";
import { getMyNotifications } from "@/lib/notifications";
import Notification from "@/components/Notification";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  connectToNotification,
  disconnectNotificationSocket,
} from "@/lib/notificationSocket";
import { useNotificationSocketContext } from "@/context/NotificationProvider";
import { useGlobalContext } from "@/context/GlobalProvider";

const notifications = () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { notifications, setNotifications } = useNotificationSocketContext();

  useFocusEffect(
    useCallback(() => {
      console.log(user);
      if (!user?.id) return; // 🚫 Nu încerca să faci fetch dacă nu e logat
      fetchNotifications();
    }, [user])
  );

  const fetchNotifications = async () => {
    if (!user?.id) return;

    setRefreshing(true);
    try {
      const fetched = await getMyNotifications();
      setNotifications(fetched);
    } catch (e) {
      console.error("Eroare la încărcarea notificărilor:", e.message);
    } finally {
      setRefreshing(false);
    }
  };

  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  return (
    <SafeAreaView
      className="bg-primary h-full"
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View className="flex-row items-center pb-4 mt-6 w-full justify-between">
        <Text className="text-white font-jsRegular text-2xl ml-4">
          Notificări
        </Text>
      </View>

      <FlatList
        data={notifications}
        //data={[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Notification
            id={item.id}
            title={item.notification.title}
            message={item.notification.message}
            read={item.read}
            type={item.notification.type}
            timestamp={item.notification.timestamp}
            referenceId={item.notification.referenceId}
            fetchNotifications={fetchNotifications} // 👈 Pass the function to refresh notifications
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 80 : 70,
          paddingTop: 8,
        }}
        // onRefresh={fetchInitialPosts}
        refreshing={refreshing}
        onEndReachedThreshold={0.2} // ✅ trigger când e aproape jos
        // onEndReached={() => {
        //   fetchMorePosts();
        // }}
        ListFooterComponent={
          loadingMore ? (
            <Text className="text-white text-center py-4">
              Se încarcă mai multe...
            </Text>
          ) : null
        }
        ListEmptyComponent={() => (
          <EmptyState
            title="Nu sunt notificări de afișat"
            //subtitle="Postează un incident!"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default notifications;
