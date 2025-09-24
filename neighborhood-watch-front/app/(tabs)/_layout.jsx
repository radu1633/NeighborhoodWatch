import { View, Text, Image, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { icons } from "@/constants";
import { getMyNotifications } from "@/lib/notifications";
import { useNotificationSocketContext } from "@/context/NotificationProvider";

const TabIcon = ({ icon, color, name, focused }) => {
  const { notifications } = useNotificationSocketContext();
  // filter out notifications that are read
  const unreadNotifications = notifications.filter((item) => !item.read);

  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  // const fetchNotifications = async () => {
  //   try {
  //     const data = await getMyNotifications();
  //     // Filter out notifications that are read
  //     const unreadNotifications = data.filter((item) => !item.read);
  //     setNotifications(unreadNotifications);
  //     console.log("Fetched notifications:", data);
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //   }
  // };

  return (
    <View className="items-center justify-center mt-7 gap-1 w-16">
      <Image
        source={icon}
        resizeMethod="contain"
        tintColor={color}
        //className="w-7 h-7"
        className={name === "Create" ? "w-12 h-12" : "w-7 h-7"}
      />
      {name === "Notifications" && unreadNotifications.length > 0 && (
        <View className="bg-customGreen absolute py-0.5 px-1.5 rounded-full bottom-2 right-3">
          <Text className="text-xs text-black font-bold">
            {unreadNotifications.length}
          </Text>
        </View>
      )}
      {/*<Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
      {name !== "Create" && (
        <Text
          className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
          style={{ color: color }}
        >
          {name}
        </Text>
      )}*/}
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#C4E76F",
          tabBarInactiveTintColor: "#7a7a80",
          tabBarStyle: {
            backgroundColor: "#141414",
            position: "absolute",
            bottom: Platform.OS === "ios" ? 23 : 10,
            left: 20,
            right: 20,
            height: 65,
            width: "90%",
            //paddingBottom: 10,
            borderRadius: 35,
            marginHorizontal: "5%",
            borderWidth: 0.5,
            borderTopWidth: 0.5,
            borderColor: "#C4E76F",
            alignItems: "center",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="contacts"
          options={{
            title: "Contacts",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.contacts}
                color={color}
                name="Contacts"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            gestureEnabled: false,
            tabBarStyle: { display: "none" },
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.create}
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifications",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bell}
                color={color}
                name="Notifications"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
