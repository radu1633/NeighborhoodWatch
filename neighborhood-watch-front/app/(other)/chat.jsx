import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import {
  connectToChat,
  disconnectFromChat,
  sendMessage,
  getMessagesByNeighborhood,
} from "@/lib/chatSocket";
import { useGlobalContext } from "@/context/GlobalProvider";
import { icons } from "@/constants";
import { router } from "expo-router";

const chat = () => {
  const { user } = useGlobalContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);
  const neighborhoodId = user?.neighborhoodId;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const initialMessages = await getMessagesByNeighborhood(neighborhoodId);
        setMessages(initialMessages);
      } catch (error) {
        console.error("❌ Eroare la încărcarea mesajelor:", error.message);
      }
    };

    fetchMessages();

    connectToChat((msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      disconnectFromChat();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({
      userId: user.id,
      neighborhoodId,
      message: input,
    });
    setInput("");
  };

  const renderItem = ({ item, index }) => {
    const isMine = item.user?.userId === user?.id;

    const previous = messages[index - 1];
    const isSameUserAsPrevious =
      previous && previous.user?.userId === item.user?.userId;

    const isFirstInGroup = !isSameUserAsPrevious;
    const containerSpacing = isFirstInGroup ? "mt-4" : "mt-1";

    return (
      <View
        className={`flex-row ${containerSpacing} ${
          isMine ? "justify-end" : "justify-start"
        }`}
      >
        <View className={`max-w-[70%] ${isMine ? "items-end" : "items-start"}`}>
          {/* Afișează numele (sau "Tu") doar o dată, la începutul grupului */}
          {isFirstInGroup && (
            <View className="flex-row items-center mb-1 ml-2 mr-2">
              {!isMine && item.user?.avatarUrl && (
                <Image
                  source={{ uri: item.user?.avatarUrl }}
                  className="w-5 h-5 rounded-full mr-1"
                />
              )}
              <Text className="text-xs text-gray-400">
                {isMine
                  ? "Tu"
                  : `${item.user?.firstName} ${item.user?.lastName}`}
              </Text>
            </View>
          )}

          {/* Bula mesajului */}
          <View
            className={`px-3 py-3 rounded-xl ${
              isMine ? "bg-zinc-700 mr-1" : "bg-primary ml-1"
            }`}
          >
            <Text className="text-white">{item.message}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <View className="h-[13%] bg-primary items-center justify-center flex-row">
        <TouchableOpacity
          className="absolute left-5 mt-[13%]"
          onPress={() => router.push("(tabs)/home")}
        >
          <Image source={icons.cancel} className="w-12 h-12" />
        </TouchableOpacity>

        <Text className="text-white text-2xl font-jsBold text-center mt-[13%]">
          Chat
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          className="w-full"
        />

        <View className="flex-row items-center border-t border-gray-600 pt-3 pb-10 bg-primary">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Scrie un mesaj..."
            placeholderTextColor="gray"
            className="w-[85%] bg-zinc-700 text-white rounded-full px-4 py-3 ml-2"
          />
          <TouchableOpacity onPress={handleSend} className="ml-4">
            <Image source={icons.send} className="w-7 h-7" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default chat;
