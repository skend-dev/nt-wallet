# NT Wallet - React Native with Expo

A React Native application built with Expo and TypeScript, featuring modern development tools and best practices.

## 🚀 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Tabs)
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query (TanStack Query)
- **Styling**: Tailwind CSS with NativeWind

## 📦 Dependencies

### Core

- `expo` - Expo SDK
- `react` - React library
- `react-native` - React Native framework
- `typescript` - TypeScript support

### Navigation

- `@react-navigation/native` - Core navigation library
- `@react-navigation/stack` - Stack navigator
- `@react-navigation/bottom-tabs` - Bottom tab navigator
- `react-native-screens` - Native screen optimization
- `react-native-safe-area-context` - Safe area handling

### State Management & Data Fetching

- `@reduxjs/toolkit` - Redux Toolkit for state management
- `react-redux` - React bindings for Redux
- `@tanstack/react-query` - Data fetching and caching

### Styling

- `nativewind` - Tailwind CSS for React Native
- `tailwindcss` - Tailwind CSS framework

## 🛠️ Setup Instructions

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm start
   ```

3. **Run on specific platforms**:
   ```bash
   npm run ios     # iOS simulator
   npm run android # Android emulator
   npm run web     # Web browser
   ```

## 📁 Project Structure

```
src/
├── hooks/           # Custom React hooks
├── lib/            # Utility libraries and configurations
├── navigation/     # Navigation configuration
├── providers/      # Context providers (Redux, React Query)
├── screens/        # Screen components
└── store/          # Redux store and slices
    └── slices/     # Redux slices
```

## 🎯 Features

- **Tab Navigation**: Bottom tab navigation with stack navigators
- **State Management**: Redux Toolkit with typed hooks
- **Data Fetching**: React Query for server state management
- **Styling**: Tailwind CSS with NativeWind for consistent styling
- **TypeScript**: Full TypeScript support with strict mode

## 🔧 Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration
- `babel.config.js` - Babel configuration with NativeWind plugin
- `tsconfig.json` - TypeScript configuration
- `global.css` - Global Tailwind CSS imports

## 📱 Screens

- **Home**: Main screen with Redux counter example
- **Details**: Example detail screen with navigation
- **Profile**: User profile screen
- **Settings**: Settings screen with toggles

## 🚀 Getting Started

The app includes example implementations of:

- Redux state management with a counter
- React Query data fetching hooks
- Navigation between screens
- Tailwind CSS styling

You can start building your wallet features by:

1. Adding new screens in `src/screens/`
2. Creating new Redux slices in `src/store/slices/`
3. Adding API hooks in `src/hooks/`
4. Updating navigation in `src/navigation/AppNavigator.tsx`
