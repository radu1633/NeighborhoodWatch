import { Stack } from "expo-router";
import "../../global.css";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="neighborhood"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {/*<StatusBar className="bg-primary" style="light" />*/}
    </>
  );
};

export default AuthLayout;
