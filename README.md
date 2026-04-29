# Financial Control Mobile

Mobile application for the Financial Control project, built with React Native and Expo.

This app is the mobile client for the Financial Control API and is being developed feature by feature, starting with the `Accounts Payable` flow.

## Current Status

The project is no longer just a clean Expo starter. It already includes:

- project structure organized under `src/`
- tab-based navigation with Expo Router
- shared Axios service layer
- frontend API contracts and shared types
- first functional feature: `Accounts Payable`
- interactive monthly summary modal with status-based pie chart
- edit and delete actions for monthly records
- native date picker support for due dates

## Stack

- React Native
- Expo
- Expo Router
- TypeScript
- Axios
- React Native SVG
- `@react-native-community/datetimepicker`
- ESLint

## Current Features

### Accounts Payable

The first implemented flow is `Accounts Payable`.

It currently supports:

- creating a bill
- selecting the due date with a native date picker
- searching bills by month and year
- showing a monthly summary in a modal
- visualizing totals by status with a pie chart
- editing a selected bill
- marking a bill as paid with a checkbox in the edit flow
- deleting a bill
- showing backend validation and business-rule messages in alerts

### Navigation

The app uses `Expo Router` with tab-based navigation.

Current tabs:

- `Accounts Payable`
- `Dashboard` placeholder
- `Settings` placeholder

## Project Structure

```text
src/
  app/
    _layout.tsx
    (tabs)/
      _layout.tsx
      index.tsx
      dashboard.tsx
      settings.tsx
  assets/
    images/
  components/
    ui/
  constants/
  hooks/
  features/
    accounts-payable/
      components/
      accounts-payable-screen.tsx
      accounts-payable.utils.ts
    coming-soon/
  service/
    core/
    accounts-payable.service.ts
  scripts/
  types/
```

## Service Layer

The API integration is split into two parts:

- `src/service/core/`: shared Axios setup, interceptors, API config, and error normalization
- `src/service/accounts-payable.service.ts`: module-specific requests for the first feature

The app already handles backend messages centrally, including:

- resource not found errors
- validation errors
- field-level validation details
- network errors

## UX Notes

Some important UI decisions already in place:

- the search filters for month and year open in overlay selectors instead of expanding the layout
- due dates use a calendar picker on supported native platforms
- status colors are consistent across the list, summary cards, and pie chart:
  - green for `Paid`
  - orange for `Pending`
  - red for `Overdue`

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

## Current Focus

The current focus is building the mobile experience on top of the existing backend, starting with `Accounts Payable`.

Planned next steps include:

- refactoring the `Accounts Payable` screen into smaller pieces
- implementing the `Credit Card` flow
- expanding reusable UI components
- improving state management for data-heavy screens

## Note

This README is intended to evolve together with the project.
