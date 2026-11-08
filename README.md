# HIGH / LOW: BATTLEGROUND — Android V4

This repository contains the complete standalone HTML5 game (root `index.html`) and a native Android WebView host.

## Download your Android APK

1. Open **Actions** in this GitHub repository.
2. Select **Build HIGH LOW Android APK**.
3. GitHub Actions automatically builds when changes reach `main`; alternatively choose **Run workflow**.
4. Wait for a green check mark, then open that workflow run.
5. In **Artifacts**, download **Battleground-V4-Android-APK**.
6. Extract `app-debug.apk`, then transfer/install it on your Android phone (approve installs from this source when Android prompts).

Debug APKs are intended for testing. Play Store release requires developer signing and publishing steps.

## Play HTML5 without Android

`index.html` is the self-contained V4 game. It supports solo and local PvP offline; online PvP requires a separately deployed Supabase service and must be tested with two devices.

## Develop

Open this folder in Android Studio, use JDK 17 and Android SDK 35. Copy `index.html` to `app/src/main/assets/index.html` before building locally. The GitHub Actions workflow does this automatically. Use Gradle 8.11.1 to build `:app:assembleDebug`. Package name: `com.highlow.battleground` (Android 7.0+).

The Android app serves its bundled HTML from `https://appassets.androidplatform.net/assets/index.html` using AndroidX `WebViewAssetLoader`, avoiding dangerous `file://` permissions. All wagers are simulated credits, not real-money payments or prizes.

**Status:** Source published; APK compilation and physical-device verification must be established from GitHub Actions results, not assumed.
