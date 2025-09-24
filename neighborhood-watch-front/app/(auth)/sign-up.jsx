import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useCallback } from "react";
import { Link, router, useNavigation } from "expo-router";
import "@/global.css";
import CustomButton from "@/components/CustomButton";
import FormField from "../../components/FormField";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { register, login } from "@/lib/auth";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getCurrentUser } from "@/lib/user";

const SignUp = () => {
  const { setUser, setIsLoggedIn, setNeighborhood } = useGlobalContext();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phoneNumber ||
      !form.password ||
      !form.confirmPassword
    ) {
      Alert.alert("Error", "Completați corect toate câmpurile!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Parolele nu se potrivesc!");
      return;
    }

    if (form.phoneNumber.length != 10) {
      Alert.alert("Error", "Numărul de telefon trebuie să aibă 10 cifre!");
      return;
    }

    try {
      const result = await register(form); // 🔥 adaugă await!
      if (result.error) {
        Alert.alert("Error", result.error);
        return;
      }

      const userData = await getCurrentUser(); // ✅ fetch user imediat

      if (!userData) {
        Alert.alert("Eroare", "Nu s-au putut încărca datele utilizatorului");
        return;
      }

      setUser(userData);
      setIsLoggedIn(true);
      setNeighborhood(userData.neighborhoodId);

      if (!userData.neighborhoodId) {
        router.replace("/neighborhood");
      } else {
        router.replace("/home");
      }
    } catch (err) {
      console.error("Register error:", err);
      Alert.alert("Eroare la înregistrare");
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
            <Text className="text-2xl text-white text-semibold mb-5 font-jsSemiBold self-start ml-1 mb-8">
              Înregistrare
            </Text>

            <FormField
              title="Nume"
              value={form.lastName}
              handleChangeText={(e) => setForm({ ...form, lastName: e })}
              otherStyles="mt-1"
            />

            <FormField
              title="Prenume"
              value={form.firstName}
              handleChangeText={(e) => setForm({ ...form, firstName: e })}
              otherStyles="mt-3"
            />

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-3"
              keyboardType="email-address"
            />

            <FormField
              title="Telefon"
              value={form.phoneNumber}
              handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
              otherStyles="mt-3"
            />

            <FormField
              title="Parolă"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-3"
            />

            <FormField
              title="Confirmare parolă"
              value={form.confirmPassword}
              handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
              otherStyles="mt-3"
            />

            <CustomButton
              title="Autentificare"
              handlePress={handleRegister}
              containerStyles={
                "w-[300px] h-[62px] mt-10 bg-[#C4E76F] self-center"
              }
              textStyles={"text-black text-xl"}
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Ai deja un cont?
              </Text>
              <Link
                href="/sign-in"
                className="text-lg font-psemibold text-customGreen"
              >
                Conectare
              </Link>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default SignUp;
