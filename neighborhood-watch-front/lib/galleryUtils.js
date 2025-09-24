import * as ImagePicker from "expo-image-picker";
import { detectImageOrientation } from "./cameraUtils";
import { isUnder100MB } from "@/lib/fileSystemUtils";

export const gallery = async (setSelectedMedia) => {
  // Cere permisiune
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert("Permisiunea pentru accesarea galeriei este necesară!");
    return;
  }

  // Deschide galeria
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    aspect: [4, 3],
    quality: 1,
  });

  // Dacă utilizatorul a selectat o imagine
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
  }
};
