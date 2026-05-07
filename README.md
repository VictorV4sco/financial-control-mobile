# Financial Control Mobile

Mobile application for the Financial Control project, built with React Native and Expo.

This app is the mobile client for the Financial Control API and is being developed feature by feature on top of a Spring Boot backend.

## Current Status

The project is already beyond the Expo starter stage and includes:

- code organized under `src/`
- tab-based navigation with Expo Router
- stacked detail flows for bill-related screens
- shared Axios service layer
- centralized backend error normalization
- typed frontend contracts for the API
- functional flows for:
  - `Accounts Payable`
  - `Credit Cards`
  - `Credit Card Bills`
  - `Transactions` inside a bill

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

The `Accounts Payable` flow currently supports:

- creating a payable entry
- selecting the due date with a native date picker
- searching records by month and year
- showing a monthly summary in a modal
- visualizing totals by status with a pie chart
- editing a selected payable
- marking a payable as paid
- deleting a payable
- showing backend validation and business-rule messages in alerts

### Credit Cards

The `Credit Cards` flow now follows the backend cycle-based billing model.

It currently supports:

- creating a card with:
  - `name`
  - `openingDay`
  - `closingDay`
  - `dueDay`
- listing saved cards
- opening a card details modal
- updating the card name and billing cycle
- deleting a card
- showing backend rule errors, such as deletion being blocked by open bills

### Credit Card Bills

The `Bills` flow now matches the new backend contract.

It currently supports:

- creating a bill by:
  - `creditCardId`
  - `year`
  - `month`
- using the backend to derive:
  - `openingDate`
  - `closingDate`
  - `dueDate`
- showing available cards with their `creditCardId`
- opening a bill workspace from a selected card
- loading a bill for a selected period
- displaying bill details such as:
  - bill id
  - card id
  - opening date
  - closing date
  - due date
  - total amount
  - status

### Transactions Inside a Bill

Inside the bill detail flow, the app currently supports:

- creating a transaction linked to the loaded bill
- simple purchases
- installment purchases
- opening a dedicated transactions screen through stack navigation
- listing bill transactions in a table
- opening a details modal for each transaction

## Navigation

The app uses `Expo Router` with tabs and stacked detail routes.

Current top-level tabs:

- `Accounts`
- `Cards`
- `Bills`
- `Settings`

Current stacked routes already in place:

- bill detail screen
- bill transactions screen

## Project Structure

```text
src/
  app/
    _layout.tsx
    (tabs)/
      _layout.tsx
      index.tsx
      cards.tsx
      bills.tsx
      settings.tsx
    bill-details/
      [cardId].tsx
    bill-transactions/
      [billId].tsx
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
    credit-cards/
      components/
      credit-card-form.utils.ts
      credit-cards-screen.tsx
    credit-card-bills/
      components/
      credit-card-bill-details-screen.tsx
      credit-card-bill-transactions-screen.tsx
      credit-card-bills-screen.tsx
    coming-soon/
  service/
    core/
    accounts-payable.service.ts
    credit-card.service.ts
    credit-card-bill.service.ts
    transaction.service.ts
  scripts/
  types/
```

## Service Layer

API integration is split into:

- `src/service/core/`
  - shared Axios setup
  - API config
  - interceptors
  - normalized error handling
- module-specific services:
  - `accounts-payable.service.ts`
  - `credit-card.service.ts`
  - `credit-card-bill.service.ts`
  - `transaction.service.ts`

The app already handles backend messages centrally, including:

- resource not found errors
- validation errors
- field-level validation details
- business-rule errors
- network errors

## UX Notes

Some important UI decisions already in place:

- month and year search fields use compact controls instead of large chip grids
- due dates and transaction dates use a native date picker on supported platforms
- bill transactions open in a dedicated stacked screen instead of a crowded modal
- transaction rows expose a details icon that opens a focused modal
- status colors are consistent in the accounts payable flow:
  - green for `Paid`
  - orange for `Pending`
  - red for `Overdue`

## Backend Contract Alignment

The mobile app is now aligned with the refactored backend billing model:

- the billing cycle belongs to the credit card
- the mobile app does not manually send bill dates anymore
- bill creation uses only:
  - `creditCardId`
  - `year`
  - `month`
- bill lookup uses the same period-based contract
- transactions remain linked to `creditCardBillId`

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

## Development Notes

For local Android emulator usage, the API base URL usually needs to target:

```text
http://10.0.2.2:8080
```

This is already handled in the shared API configuration for the Android emulator flow.

## Current Focus

The current focus is refining the mobile experience on top of the new backend contract.

Likely next steps include:

- polishing the bill and transaction UX
- adding bill status update actions
- expanding transaction editing and deletion flows
- improving reusable UI primitives
- revisiting state management as data-heavy screens grow

## Note

This README is intended to evolve together with the project.
