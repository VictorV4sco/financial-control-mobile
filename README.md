# Financial Control Mobile

Mobile application for the Financial Control project, built with React Native and Expo.

The goal of this app is to serve as the mobile interface for the Financial Control API, which is responsible for managing:

- accounts payable
- credit cards
- credit card bills
- transactions

## Current Status

The project is in its initial setup phase.

So far, the following has been done:

- project creation with Expo
- project structure reorganization to `src/`
- removal of the default Expo starter boilerplate
- creation of a minimal initial screen to serve as a clean starting point

## Stack

- React Native
- Expo
- Expo Router
- TypeScript
- ESLint

## Current Structure

```text
src/
  app/
    _layout.tsx
    index.tsx
    (tabs)/
  assets/
    images/
  components/
    ui/
  constants/
  hooks/
  scripts/
```

## Navigation

The project uses `Expo Router`, so navigation is based on files and folders inside `src/app`.

Examples:

- `src/app/index.tsx`: initial screen
- `src/app/_layout.tsx`: root layout and main navigation configuration
- `src/app/(tabs)/`: reserved group for future tab-based navigation

## How To Run

1. Install dependencies:

```bash
npm install
```

2. Start the project:

```bash
npx expo start
```

You can open the app in:

- Android Emulator
- iOS Simulator
- Expo Go
- web browser

## Next Steps

- define the app functional structure
- create the API integration layer
- model frontend types and contracts
- build the first financial flow screens

## Note

This README will be updated as the project evolves.
