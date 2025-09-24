import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { getContacts } from "@/lib/contacts";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";

const SelectAdmin = ({ visible, onClose, onSelectAdmin }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (visible) {
      const fetchContacts = async () => {
        try {
          const contacts = await getContacts();
          const nonAdmins = contacts.filter((c) => !c.admin);
          setUsers(nonAdmins);
        } catch (error) {
          console.error("Eroare la încărcarea utilizatorilor:", error);
        }
      };

      fetchContacts();
    }
  }, [visible]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.8}
      style={{
        margin: 0,
        justifyContent: "flex-end",
      }}
    >
      <SafeAreaView className="bg-secondary p-4 rounded-t-3xl h-[70%]">
        <View className="w-12 h-1.5 bg-gray-400 rounded-full self-center mb-3" />
        <Text className="text-xl text-white font-bold mb-3 font-jsSemiBold">
          Alege un nou admin:
        </Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelectAdmin(item)}
              className="py-2 border-b border-customGreen"
            >
              <Text className="text-lg text-white font-jsSemiBold">
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default SelectAdmin;
