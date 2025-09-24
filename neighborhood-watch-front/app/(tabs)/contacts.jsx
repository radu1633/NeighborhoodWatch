import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Contact from "@/components/Contact";
import { getContacts } from "@/lib/contacts";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";

const Contacts = () => {
  const [userContacts, setUserContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const fetchedContacts = await getContacts();
        setUserContacts(fetchedContacts);
        setFilteredContacts(fetchedContacts);
      } catch (error) {
        console.error("❌ Failed to load contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredContacts(userContacts);
    } else {
      const filtered = userContacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchText, userContacts]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-row justify-between items-center pb-4 mt-3">
        {!isSearchActive && (
          <Text className="text-white font-jsRegular text-2xl mt-3 ml-4">
            Contacte
          </Text>
        )}
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          onSearchToggle={(active) => {
            setIsSearchActive(active);
            if (!active) setSearchText(""); // Resetează și lista
          }}
        />
      </View>

      <FlatList
        data={filteredContacts}
        //data={[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Contact {...item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
        ListEmptyComponent={() => (
          <EmptyState
            title="Nu sunt contacte de afișat"
            subtitle="Invită vecinii în cartier!"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Contacts;
