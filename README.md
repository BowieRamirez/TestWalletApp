# 🏦 Banking Mobile App

A secure, feature-rich banking mobile application built with **Expo SDK 54**, **React Native**, and **TypeScript**. This app follows **Feature-Sliced Design (FSD)** architecture and **Clean Architecture** principles for maintainable, scalable code.

![Expo](https://img.shields.io/badge/Expo-54.0.31-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-10.28.x-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-2.4.x-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)

---

## 📱 Features

- 🔐 **Biometric Authentication** - FaceID / TouchID / Fingerprint
- 💳 **Account Management** - View balances, account details
- 💸 **Money Transfers** - Send money to recipients
- 📜 **Transaction History** - View and filter transactions
- 📷 **QR Code Payments** - Scan and pay via QR codes
- 🛡️ **Bank-Grade Security** - Secure storage, encryption, auto-logout
- 🌙 **Dark Mode Support** - Automatic theme switching
- 🔄 **Offline Support** - Cached data with TanStack Query

---

## 🏗️ Architecture

### Monorepo Structure (pnpm + Turborepo)

```
banking-mobile/
├── apps/
│   └── mobile/              # Expo mobile app with Expo Router
├── packages/
│   ├── ui/                  # 🎨 Shared design system
│   ├── api/                 # 🔌 Shared API client
│   ├── config/              # ⚙️ Shared ESLint, TS configs
│   └── security/            # 🔒 Security utilities
```

### Feature-Sliced Design (FSD) Layers

```
apps/mobile/src/
├── app/                     # App initialization, providers
├── processes/               # Multi-step flows (transfer flow)
├── widgets/                 # Composite components
├── features/                # Domain features
│   ├── auth/               # Authentication
│   ├── transfer/           # Money transfers
│   ├── transaction/        # Transaction history
│   ├── account/            # Account management
│   └── qr-payment/         # QR code payments
├── entities/                # Domain models
│   ├── user/
│   ├── account/
│   ├── transaction/
│   └── recipient/
└── shared/                  # UI kit, API, utilities
```

---

## 🚀 Tech Stack

### Core Framework
| Technology | Version | Description |
|------------|---------|-------------|
| ![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white) | 54.0.31 | React Native framework |
| ![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=flat-square&logo=react&logoColor=black) | 0.81.5 | Mobile app framework |
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | 19.2.0 | UI library |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | 5.7.x | Type safety |

### State Management
| Technology | Version | Description |
|------------|---------|-------------|
| ![Zustand](https://img.shields.io/badge/Zustand-5.x-433E38?style=flat-square) | 5.x | Client state management |
| ![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=flat-square&logo=reactquery&logoColor=white) | 5.x | Server state management |

### Navigation & Routing
| Technology | Description |
|------------|-------------|
| ![Expo Router](https://img.shields.io/badge/Expo%20Router-000020?style=flat-square&logo=expo&logoColor=white) | File-based routing |
| ![React Navigation](https://img.shields.io/badge/React%20Navigation-6.x-7B61FF?style=flat-square) | Navigation library |

### Security
| Technology | Description |
|------------|-------------|
| 🔐 expo-secure-store | Secure keychain storage |
| 🧬 expo-local-authentication | Biometric authentication |
| 🗄️ react-native-mmkv | High-performance encrypted storage |

### Build & Development
| Technology | Version | Description |
|------------|---------|-------------|
| ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white) | 10.28.x | Package manager |
| ![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white) | 2.4.x | Build system |
| ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=flat-square&logo=eslint&logoColor=white) | 8.x | Code linting |
| ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black) | 3.x | Code formatting |

---

## 🛠️ Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 10.28.0
- **Xcode** (for iOS development - macOS only)
- **Android Studio** (for Android development)
- **Expo Go** app on your device (or use simulator)

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/BowieRamirez/TestWalletApp.git
cd TestWalletApp
```

### 2. Install dependencies

```bash
# Install pnpm globally (if not installed)
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 3. Set up environment variables

```bash
# Copy the example environment file
cp apps/mobile/.env.example apps/mobile/.env

# Edit .env with your API configuration
API_BASE_URL=https://api.banking.example.com
API_VERSION=v1
APP_ENV=development
ENABLE_DEV_TOOLS=true
```

---

## 🚀 Running the App

### Start the development server

```bash
# From the root of the monorepo
pnpm dev

# Or navigate to the mobile app
cd apps/mobile
pnpm start
```

### Run on iOS Simulator (macOS only)

```bash
pnpm ios

# Or with specific device
pnpm ios --device="iPhone 15 Pro"
```

### Run on Android Emulator

```bash
pnpm android

# Or with specific device
pnpm android --device="Pixel_7_API_34"
```

### Run on Physical Device

1. Install **Expo Go** from App Store / Play Store
2. Start the development server: `pnpm dev`
3. Scan the QR code displayed in the terminal with your device

---

## 📋 Available Scripts

| Script | Description | Command |
|--------|-------------|---------|
| `pnpm dev` | Start Expo development server | `turbo dev` |
| `pnpm build` | Build all packages | `turbo build` |
| `pnpm lint` | Run ESLint across all packages | `turbo lint` |
| `pnpm typecheck` | Run TypeScript type checking | `turbo typecheck` |
| `pnpm test` | Run all tests | `turbo test` |
| `pnpm clean` | Clean build artifacts | `turbo clean` |

### Mobile App Scripts

| Script | Description |
|--------|-------------|
| `pnpm start` | Start Expo development server |
| `pnpm ios` | Run on iOS simulator |
| `pnpm android` | Run on Android emulator |
| `pnpm web` | Run on web browser |
| `pnpm lint` | Lint mobile app code |
| `pnpm typecheck` | Type check mobile app |

---

## 🔒 Security Features

- ✅ **Biometric Authentication** - FaceID, TouchID, Fingerprint
- ✅ **Secure Token Storage** - JWT tokens in iOS Keychain / Android Keystore
- ✅ **MMKV Encryption** - Encrypted cache storage
- ✅ **Auto-Logout** - Automatic logout after 5 minutes of inactivity
- ✅ **JWT Refresh Token Rotation** - Secure token refresh
- ✅ **API Request Signing** - HMAC request signing (placeholder)
- ✅ **Screenshot Prevention** - Disabled on sensitive screens
- ✅ **Jailbreak/Root Detection** - App security checks

---

## 🏛️ Architecture Decisions

### Why Feature-Sliced Design (FSD)?

FSD provides clear boundaries between different layers of the application:

- **Shared** → Reusable utilities, UI components
- **Entities** → Business entities (User, Account, Transaction)
- **Features** → User-facing features (Auth, Transfers)
- **Widgets** → Composite components (Account Card, Transaction List)
- **Processes** → Multi-step flows (Transfer Flow)
- **App** → App initialization, routing, providers

### Why Zustand + TanStack Query?

- **Zustand**: Lightweight, no boilerplate, excellent TypeScript support
- **TanStack Query**: Powerful server state management, caching, synchronization

### Why pnpm + Turborepo?

- **pnpm**: Fast, disk space efficient, strict dependency management
- **Turborepo**: Intelligent caching, parallel execution, optimized builds

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd apps/mobile
pnpm test

# Run tests in watch mode
pnpm test --watch
```

---

## 🚀 Deployment

### Staging (Internal Testing)

Push to the `develop` branch to trigger automatic staging builds:

```bash
git checkout develop
git merge feature/your-feature
git push origin develop
```

This will:
- Build the app with EAS
- Submit to TestFlight (iOS internal)
- Submit to Play Console (Android internal)

### Production (App Stores)

Create a new release on GitHub to trigger production deployment:

1. Go to GitHub Releases
2. Click "Create a new release"
3. Tag version (e.g., `v1.0.0`)
4. Publish release

This will:
- Build production app
- Submit to App Store
- Submit to Play Store

---

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/           # CI/CD pipelines
├── apps/
│   └── mobile/
│       ├── app/            # Expo Router routes
│       ├── src/            # FSD architecture
│       ├── package.json
│       ├── tsconfig.json
│       ├── metro.config.js
│       └── app.json        # Expo config
├── packages/
│   ├── api/                # API client
│   ├── config/             # Shared configs
│   ├── security/           # Security utilities
│   └── ui/                 # Design system
├── package.json            # Root workspace
├── pnpm-workspace.yaml     # Workspace config
├── turbo.json              # Turborepo config
└── README.md
```

---

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run linting and type checking: `pnpm lint && pnpm typecheck`
4. Commit your changes: `git commit -m "feat: add your feature"`
5. Push to the branch: `git push origin feature/your-feature`
6. Open a Pull Request


---

## 🆘 Support

For support, email dev@bowieramirez.com or open an issue on GitHub.

---

<p align="center">
  Built with ❤️ using Expo, React Native, and TypeScript
</p>
