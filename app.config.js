
export default {
    expo: {
        name: "reelverse",
        slug: "reelverse",
        version: "1.0.0",
        extra: {
            eas: {
                projectId: "5fdbce41-fdc6-4e45-8211-0bd0bc6f56e8"
            }
        },
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "reelverse",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true
        },
        android: {
            package: "com.reelverse.app",
            versionCode: 1,

            adaptiveIcon: {
                backgroundColor: "#E6F4FE",
                foregroundImage: "./assets/images/android-icon-foreground.png",
                backgroundImage: "./assets/images/android-icon-background.png",
                monochromeImage: "./assets/images/android-icon-monochrome.png"
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false
        },
        web: {
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                    dark: {
                        backgroundColor: "#ffffff"
                    }
                }
            ]
        ],
        experiments: {
            typedRoutes: true,
            reactCompiler: true
        }
    }
};
