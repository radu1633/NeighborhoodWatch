/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#222222",
        secondary: "#111111",
        third: "#4568dc",
        customGray: "#080808",
        customGreen: "#C4E76F",
      },
      fontFamily: {
        jsthin: ["JosefinSans_100Thin"],
        jsExtraLight: ["JosefinSans_200ExtraLight"],
        jsLight: ["JosefinSans_300Light"],
        jsRegular: ["JosefinSans_400Regular"],
        jsMedium: ["JosefinSans_500Medium"],
        jsSemiBold: ["JosefinSans_600SemiBold"],
        jsBold: ["JosefinSans_700Bold"],
        jsThinItalic: ["JosefinSans_100Thin_Italic"],
        jsExtraLItalic: ["JosefinSans_200ExtraLight_Italic"],
        jsLightItalic: ["JosefinSans_300Light_Italic"],
        jsRegularItalic: ["JosefinSans_400Regular_Italic"],
        jsMediumItalic: ["JosefinSans_500Medium_Italic"],
        jsSemiBoldItalic: ["JosefinSans_600SemiBold_Italic"],
        jsBoldItalic: ["JosefinSans_700Bold_Italic"],
      },
    },
  },
  plugins: [],
};
