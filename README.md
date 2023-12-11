# LumoSymc

This is a [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Getting Started

### Step 0: Prerequisites

Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

### Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
yarn start
```

### Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

#### For Android

```bash
yarn android
```

#### For iOS

```bash
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Code Structure

```
Lumosync
|- android/ - Android Native Code
|- ios/ - iOS Native Code
|- src/ - React Native Code
    |- components/ - React Native Components
    |- navigation/ - React Navigation
    |- screens/ - React Native Screens
        |- GroupControl/ - Group Control Screen 
        |- Home/ - Home Screen
        |- PeripheralControl/ - Individual Peripheral Control Screen
        |- Peripherals/ - Peripherals Screen (For debugging)
        |- LogViewer.tsx - Log Viewer Screen (For debugging)
    |- state/ - Zustand State Management
    |- types/ - TypeScript Types
    |- utils/ - Utility Functions
```

# Building Releases

## For Android

```bash
cd android
./gradlew assembleRelease
```

## For iOS

Use Xcode to build the release.

# Troubleshooting

You may need to enable adb reverse if you're using a physical Android device.

```bash
adb reverse tcp:8081 tcp:8081
```

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
