import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants";
import Post from "@/components/Post";
import { router } from "expo-router";
import { getIncidentsByNeighborhoodPaginated } from "@/lib/incidents";
import { useGlobalContext } from "@/context/GlobalProvider";
import EmptyState from "@/components/EmptyState";
import { sendEmergecyMessage } from "@/lib/notifications";

const PAGE_SIZE = 10;

const home = () => {
  const [posts, setPosts] = useState([]);
  const { neighborhood, user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchInitialPosts();
  }, []);

  const fetchInitialPosts = async () => {
    setRefreshing(true);
    try {
      const data = await getIncidentsByNeighborhoodPaginated(
        neighborhood,
        0,
        PAGE_SIZE
      );
      setPosts(data);
      setPage(1);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error("❌ Eroare la încărcarea postărilor:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchMorePosts = async () => {
    if (!hasMore || loadingMore || refreshing) return;

    setLoadingMore(true);
    try {
      const data = await getIncidentsByNeighborhoodPaginated(
        neighborhood,
        page,
        PAGE_SIZE
      );
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNew = data.filter((p) => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });

      setPage((prev) => prev + 1);
      if (data.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      console.error("❌ Eroare la încărcarea paginii următoare:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <SafeAreaView
      className="bg-primary h-full"
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View className="flex-row items-center pb-4 mt-6 w-full justify-between">
        <Text className="text-white font-jsRegular text-2xl ml-4">Acasă</Text>
        <View className="flex-row gap-4">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert(
                "Trimitere mesaj de urgență",
                "Acest mesaj va fi trimis către toate contactele de urgență. Ești sigur că vrei să continui?",
                [
                  { text: "Anulează", style: "cancel" },
                  {
                    text: "Trimite",
                    style: "destructive",
                    onPress: () => sendEmergecyMessage(),
                  },
                ]
              );
            }}
          >
            <Image
              source={icons.emergency}
              style={{ tintColor: "red" }}
              className="w-8 h-8 mt-0.5"
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(other)/chat")}
          >
            <Image source={icons.chat} className="w-10 h-10 mr-3" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        //data={[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Post {...item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 80 : 70,
          paddingTop: 8,
        }}
        onRefresh={fetchInitialPosts}
        refreshing={refreshing}
        onEndReachedThreshold={0.2} // ✅ trigger când e aproape jos
        onEndReached={() => {
          fetchMorePosts();
        }}
        ListFooterComponent={
          loadingMore ? (
            <Text className="text-white text-center py-4">
              Se încarcă mai multe...
            </Text>
          ) : null
        }
        ListEmptyComponent={() => (
          <EmptyState
            title="Nu sunt incidente de afișat"
            subtitle="Postează un incident!"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default home;
