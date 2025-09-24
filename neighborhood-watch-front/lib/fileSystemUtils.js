import * as FileSystem from "expo-file-system";

export const isUnder100MB = async (uri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const sizeInMB = fileInfo.size / (1024 * 1024); // bytes → MB
    return sizeInMB <= 100;
  } catch (err) {
    console.error("Eroare la verificarea dimensiunii fișierului:", err);
    return false;
  }
};
