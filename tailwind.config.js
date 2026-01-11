/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                manrope: ["Manrope_400Regular"],
                "manrope-medium": ["Manrope_500Medium"],
                "manrope-semibold": ["Manrope_600SemiBold"],
                "manrope-bold": ["Manrope_700Bold"],
                "manrope-extrabold": ["Manrope_800ExtraBold"],
            },
            colors: {
                primary: "#0a7ea4",
                background: {
                    light: "#fff",
                    dark: "#151718",
                },
            },
        },
    },
    plugins: [],
};
