# 🏦 MyBank — Mobile Banking App

A feature-rich mobile banking application built with **React Native (Expo)** in a **Turborepo** monorepo, delivering secure, performant, and intuitive financial services on iOS & Android.

---

## Tech Stack

<p>
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" />
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="NativeWind / Tailwind CSS" />
  <img src="https://img.shields.io/badge/Zustand-433D37?style=for-the-badge&logo=zustand&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack React Query" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
</p>

| Category | Technology |
| --- | --- |
| **Framework** | React Native 0.81 via Expo SDK 54 |
| **Language** | TypeScript 5.9 |
| **Monorepo** | Turborepo + pnpm workspaces |
| **Routing** | Expo Router (file-based) |
| **Styling** | NativeWind 4 (Tailwind CSS) |
| **Icons** | Lucide React Native |
| **State (client)** | Zustand |
| **State (server)** | TanStack React Query |
| **Persistence** | react-native-mmkv |
| **Networking** | Axios |
| **Validation** | Zod |
| **Auth** | expo-local-authentication, expo-secure-store |
| **Animations** | React Native Reanimated |
| **Testing** | Jest + React Native Testing Library |

---

## Project Structure

```
mybank-monorepo/
├── apps/
│   └── mobile/                 # Main Expo app
│       ├── app/                # Expo Router screens (file-based routing)
│       │   ├── (auth)/         # Auth screens (login, biometric)
│       │   ├── (tabs)/         # Tab navigation (home, accounts, transfers)
│       │   └── (modals)/       # Modal screens (transfer wizard, receipt)
│       ├── src/
│       │   ├── features/       # Domain feature modules
│       │   │   ├── auth/       # Authentication logic & stores
│       │   │   ├── accounts/   # Account hooks & services
│       │   │   └── transfers/  # Transfer services & wizard store
│       │   ├── lib/            # Utilities (MMKV, schemas)
│       │   ├── providers/      # Global providers (Auth, QueryClient)
│       │   └── services/       # API client layer
│       └── assets/             # Static assets (icons, splash)
├── packages/
│   ├── ui/                     # Shared design system (@mybank/ui)
│   │   └── src/
│   │       ├── components/     # Reusable components (Button, Card, Input…)
│   │       ├── theme/          # Design tokens (colors, spacing, typography)
│   │       └── utils/          # UI helpers (cn utility)
│   ├── tsconfig/               # Shared TypeScript configs (@mybank/tsconfig)
│   └── eslint-config/          # Shared ESLint config (@mybank/eslint-config)
├── turbo.json                  # Turborepo pipeline config
├── pnpm-workspace.yaml         # Workspace definitions
└── package.json                # Root scripts
```

---

## Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 10 — `corepack enable && corepack prepare pnpm@10.29.2 --activate`
- **Expo CLI** — installed via project dependencies
- **iOS Simulator** (macOS) or **Android Emulator** for running the app
- **EAS CLI** (optional, for cloud builds) — `pnpm add -g eas-cli`

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/mybank-monorepo.git
cd mybank-monorepo
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Generate native projects (required for native modules like MMKV)

```bash
cd apps/mobile
pnpm prebuild
```

### 4. Start the dev server

```bash
# From the root (uses Turborepo)
pnpm dev

# Or directly from the mobile app
cd apps/mobile
pnpm dev
```

### 5. Run on a device / simulator

```bash
# iOS (macOS only)
cd apps/mobile
pnpm ios

# Android
cd apps/mobile
pnpm android
```

---

## Available Scripts

All scripts can be run from the **monorepo root** via Turborepo:

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Expo dev server |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all workspaces |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm test` | Run all tests |
| `pnpm clean` | Remove build artifacts & caches |

### Mobile-specific scripts (from `apps/mobile/`):

| Command | Description |
| --- | --- |
| `pnpm start` | Start Expo bundler |
| `pnpm ios` | Run on iOS simulator |
| `pnpm android` | Run on Android emulator |
| `pnpm prebuild` | Generate native iOS/Android projects |

---

## Core Features

- **🔐 Secure Authentication** — Biometric login (Face ID / Touch ID), secure token storage, auto-logout on inactivity.
- **📊 Account Dashboard** — Aggregate balance view, hide-balance toggle, pull-to-refresh.
- **💸 Money Transfers** — Multi-step wizard (Recipient → Amount → Review → PIN), favorite recipients, transaction receipts.

---

## Architecture

The codebase follows **Clean Architecture** within a monorepo:

```
UI Event → Service / Hook → Store Update → UI Re-render
```

- **`packages/ui`** — Framework-agnostic design system consumed by the mobile app.
- **`apps/mobile/src/features`** — Domain-driven modules encapsulating hooks, services, stores, and types per feature.
- **`apps/mobile/app`** — Expo Router file-based screens; no business logic, only composition.

---

## CI / CD

Recommended GitHub Actions pipeline:

```yaml
steps:
  - run: pnpm install --frozen-lockfile
  - run: pnpm lint
  - run: pnpm type-check
  - run: pnpm test
  - run: eas build --profile preview   # Optional EAS Build
```
