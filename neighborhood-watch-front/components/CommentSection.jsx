import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { icons } from "@/constants";
import { getComments, addComment, deleteComment } from "@/lib/comments";
import { useEffect } from "react";
import { formatRelativeTime } from "@/lib/formatDate";
import { useGlobalContext } from "@/context/GlobalProvider";

const CommentSection = ({ isVisible, onClose, incidentId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const { user } = useGlobalContext();

  useEffect(() => {
    const fetchComments = async () => {
      if (isVisible && incidentId) {
        try {
          const fetchedComments = await getComments(incidentId);
          setComments(fetchedComments);
          setNewComment("");
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      }
    };

    fetchComments();
  }, [isVisible, incidentId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await addComment(incidentId, newComment);
        setNewComment("");
        const updatedComments = await getComments(incidentId);
        setComments(updatedComments);
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId); // backend delete
      setComments((prev) => prev.filter((c) => c.id !== commentId)); // local update
    } catch (error) {
      console.error("Eroare la ștergerea comentariului:", error);
      alert("Comentariul nu a putut fi șters.");
    }
  };

  const renderItem = ({ item }) => {
    const isOwnComment = item.id === user.id;

    return (
      <TouchableOpacity
        onLongPress={() => {
          if (isOwnComment) {
            Alert.alert(
              "Ștergere comentariu",
              "Ești sigur că vrei să ștergi comentariul?",
              [
                { text: "Anulează", style: "cancel" },
                {
                  text: "Șterge",
                  style: "destructive",
                  onPress: () => handleDeleteComment(item.id),
                },
              ]
            );
          }
        }}
        activeOpacity={0.8}
      >
        {/* Afișarea comentariului */}
        <View className="mb-8">
          <View className="flex-row items-center">
            <Image
              source={
                item.authorPicture
                  ? { uri: item.authorPicture }
                  : icons.anonymous
              }
              className="w-[40px] h-[40px] rounded-full"
            />
            <View className="ml-2">
              <Text className="text-white font-semibold">{item.author}</Text>
              <Text className="text-gray-400 text-xs">
                {formatRelativeTime(item.timestamp)}
              </Text>
            </View>
          </View>
          <Text className="text-white mt-1">{item.text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => {}}
      swipeDirection="down"
      onSwipeComplete={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.8}
      style={{
        margin: 0,
        justifyContent: "flex-end",
      }}
      propagateSwipe={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        //keyboardVerticalOffset={80}
        className="bg-secondary rounded-t-3xl h-[70%] p-4"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={{
            alignSelf: "center",
            width: 50,
            height: 6,
            borderRadius: 3,
            backgroundColor: "gray",
            marginBottom: 10,
          }}
        />
        <Text className="text-white text-center text-lg mb-4">Comentarii</Text>

        <FlatList
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />

        <View className="flex-row items-center border-t border-gray-600 pt-3 pb-10">
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Scrie un comentariu..."
            placeholderTextColor="gray"
            className="w-[85%] bg-primary text-white rounded-full px-4 py-3"
          />
          <TouchableOpacity onPress={handleAddComment} className="ml-5">
            <Image source={icons.send} className="w-7 h-7" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentSection;
