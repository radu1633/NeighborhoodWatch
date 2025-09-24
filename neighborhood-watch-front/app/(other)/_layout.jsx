import { Stack } from "expo-router";
import "../../global.css";
import { StatusBar } from "expo-status-bar";

const OtherLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="profile_more"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="chat"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="other_profile"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="edit_incident"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="post_page"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {/*<StatusBar className="bg-primary" style="light" />*/}
    </>
  );
};

export default OtherLayout;
