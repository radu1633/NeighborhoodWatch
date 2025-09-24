import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { Link, router, useNavigation } from "expo-router";
import "@/global.css";
import CustomButton from "@/components/CustomButton";
import FormField from "../../components/FormField";
import { useFocusEffect } from "@react-navigation/native";
import { useGlobalContext } from "@/context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "@/lib/auth";
import { getCurrentUser } from "@/lib/user";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SignIn = () => {
  const { setUser, setIsLoggedIn, setNeighborhood } = useGlobalContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Completați corect toate câmpurile");
      return;
    }

    setIsSubmitting(true);

    try {
      const tokenData = await login(form.email, form.password);
      if (!tokenData) {
        setIsSubmitting(false);
        return;
      }

      const userData = await getCurrentUser(); // doar o dată
      if (!userData) {
        setIsSubmitting(false);
        return;
      }

      // populatezi contextul global
      setUser(userData);
      setIsLoggedIn(true);
      setNeighborhood(userData.neighborhoodId);

      // redirectare în funcție de neighborhood
      if (!userData.neighborhoodId) {
        router.replace("/neighborhood");
      } else {
        router.replace("/home");
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("Login error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 h-full">
      <View className="bg-black h-1/3 w-full items-center justify-center">
        <Text className="text-white text-xl font-jsRegular ">
          bine ai venit la...
        </Text>
        <Text className="text-white text-[30px] font-jsBold">Neighborhood</Text>
        <Text className="text-white text-[30px] font-jsBold mt-1">Watch</Text>
      </View>
      <View className="bg-primary rounded-t-[30px] -mt-8 px-6 py-10 flex-1 items-center w-full">
        <KeyboardAwareScrollView
          enableOnAndroid
          className="w-full"
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            className="w-full"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-2xl text-white text-semibold mb-5 font-jsSemiBold self-start ml-1 mb-14">
              Conectare
            </Text>

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-1"
              keyboardType="email-address"
            />

            <FormField
              title="Parolă"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Autentificare"
              handlePress={handleLogin}
              containerStyles={
                "w-[300px] h-[62px] mt-14 bg-[#C4E76F] self-center"
              }
              textStyles={"text-black text-xl"}
              isLoading={isSubmitting}
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Nu ai un cont?
              </Text>
              <Link
                href="/sign-up"
                className="text-lg font-psemibold text-customGreen"
              >
                Înregistrare
              </Link>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default SignIn;
