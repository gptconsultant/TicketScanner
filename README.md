# Event Ticket Scanner Mobile App

A React Native (Expo) mobile app for event staff to scan and validate tickets with multi-gate tracking, role-based access, and offline capabilities.

## Features

- 📱 Cross-platform mobile app (iOS/Android)
- 📷 QR code ticket scanning
- 🔄 Offline mode for scanning without internet connection
- 👥 Role-based access control ("Admin", "Staff", "Volunteer")
- 🚪 Multiple gate/entrance tracking
- ⚙️ Customizable validation rules
- 📊 Ticket validation history

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your iOS or Android device

### Running the App on Your Mobile Device

There are two main ways to run this app on your mobile device:

#### Option 1: Using Expo Go

1. Clone this repository to your local machine
2. Install dependencies:
   ```
   npm install
   ```
3. Start the Expo development server:
   ```
   npx expo start
   ```
4. Scan the QR code with your device's camera (iOS) or the Expo Go app (Android)

#### Option 2: Publish to Your Expo Account

1. Make sure you have an [Expo account](https://expo.dev/signup)
2. Run the publish script:
   ```
   node expo-publish.js
   ```
3. Follow the prompts to log in and publish
4. Open the Expo Go app on your device and sign in to your account
5. Your app will appear in the "Projects" tab

### Demo Accounts

For testing purposes, you can use these demo accounts:

- Admin: Username: `admin`, Password: `password`
- Staff: Username: `staff`, Password: `password`
- Volunteer: Username: `volunteer`, Password: `password`

## App Structure

```
/
├── assets/               # App icons and splash screen
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Context for state management
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation structure
│   ├── screens/          # App screens
│   ├── services/         # API and data services
│   └── utils/            # Utility functions
├── App.js                # Main application entry point
└── app.json              # Expo configuration
```

## Key Screens

### Authentication
- Login Screen: For user authentication
- Logout Screen: For signing out

### Admin Screens
- Dashboard: Overview of events and statistics
- Manage Events: Create, edit, and delete events
- Manage Gates: Configure entrance points
- Manage Rules: Set up ticket validation rules

### Staff Screens
- Event Selection: Choose which event to work with
- Gate Selection: Select the specific entrance point
- Scanner: Scan and validate tickets
- Ticket Details: View detailed ticket information

### Volunteer Screens
- Scanner: Simplified scanning interface
- Checkout: End of shift reporting

## Offline Mode

The app supports working without an internet connection:

1. Ticket data is cached locally when online
2. Scans performed offline are stored in a queue
3. When connection is restored, the app synchronizes data with the server

## Building for Production

To create standalone app builds for iOS and Android:

1. Configure your [app.json](https://docs.expo.dev/versions/latest/config/app/)
2. Set up [EAS Build](https://docs.expo.dev/build/setup/)
3. Run the build command:
   ```
   eas build --platform ios
   ```
   or
   ```
   eas build --platform android
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.