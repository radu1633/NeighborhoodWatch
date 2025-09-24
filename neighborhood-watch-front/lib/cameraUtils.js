import { Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { isUnder100MB } from "@/lib/fileSystemUtils";

export const openCamera = async (setSelectedMedia, setImageSize) => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Permisiune refuzată",
      "Trebuie să acorzi acces la cameră pentru a folosi această funcție."
    );
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false, // No cropping
    quality: 1,
  });

  if (!result.canceled) {
    const validAssets = [];

    for (const asset of result.assets) {
      const isValid = await isUnder100MB(asset.uri);
      if (isValid) {
        validAssets.push(asset);
      } else {
        alert(
          `Fișierul ${
            asset.fileName || "media"
          } depășește 100MB și a fost ignorat.`
        );
      }
    }

    setSelectedMedia((prev) => [...prev, ...validAssets]);
    detectImageOrientation(uri, setImageSize);
  }
};

export const detectImageOrientation = (uri, setImageSize) => {
  Image.getSize(uri, (width, height) => {
    if (height > width) {
      // Portrait Mode
      setImageSize({ width: "100%", height: 400 });
    } else {
      // Landscape Mode
      setImageSize({ width: "100%", height: 250 });
    }
  });
};

export const deletePhoto = (setSelectedImage) => {
  setSelectedImage(null);
};
