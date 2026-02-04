# Vite Feature Flag Demo

A comprehensive demonstration project for implementing custom feature flags in a React application using Vite, TypeScript, and TanStack Router. This project serves as a proof of concept for trunk-based development workflows.

## Table of Contents

- [Overview](#overview)
- [What are Feature Flags?](#what-are-feature-flags)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Implementation Details](#implementation-details)
- [Scripts](#scripts)
- [Architecture Decisions](#architecture-decisions)
- [Production Considerations](#production-considerations)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project showcases how to build a simple yet effective feature flag system without relying on third-party services like LaunchDarkly or Unleash. It demonstrates:

- **Custom Feature Flag Implementation**: A lightweight, type-safe feature flag library built with React Context
- **Monorepo Architecture**: Using pnpm workspaces and Turborepo for scalable project organization
- **Modern React Patterns**: Leveraging React 19, TypeScript, and TanStack Router
- **Trunk-Based Development**: Enabling continuous integration by merging incomplete features behind flags

## What are Feature Flags?

Feature flags (also known as feature toggles or feature switches) are a software development technique that allows you to enable or disable features without deploying new code. They provide several benefits:

### Benefits for Development Teams

| Benefit | Description |
|---------|-------------|
| **Continuous Integration** | Merge incomplete features to main branch safely |
| **Gradual Rollouts** | Release features to a percentage of users |
| **A/B Testing** | Test different implementations with real users |
| **Quick Rollbacks** | Disable problematic features instantly without redeployment |
| **Trunk-Based Development** | Eliminate long-lived feature branches |

### Trunk-Based Development Flow

```
Traditional Flow:
  feature-branch ──────────────────────────► merge (risky, large PR)
                    (weeks of development)

Trunk-Based Flow with Feature Flags:
  main ─┬─ small PR (flag OFF) ─┬─ small PR (flag OFF) ─┬─ enable flag ─► release
        │                       │                       │
        └───────────────────────┴───────────────────────┘
              (continuous small merges, always deployable)
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Vite](https://vitejs.dev/) | 7.0.4 | Next-generation build tool and dev server |
| [React](https://react.dev/) | 19.1.0 | UI framework with concurrent features |
| [TypeScript](https://www.typescriptlang.org/) | 5.8.3 | Static type checking |
| [TanStack Router](https://tanstack.com/router) | 1.158.0 | Type-safe file-based routing |
| [Turborepo](https://turbo.build/) | 2.8.3 | High-performance monorepo build system |
| [Biome](https://biomejs.dev/) | 2.0.0 | Fast linter and formatter (Rust-based) |
| [pnpm](https://pnpm.io/) | 10.9.0 | Fast, disk space efficient package manager |
| [Node.js](https://nodejs.org/) | 24.13.0 | JavaScript runtime |

## Project Structure

```
vite-feature-flag-demo/
├── apps/
│   └── web/                          # Main React application
│       ├── src/
│       │   ├── routes/               # TanStack Router file-based routes
│       │   │   ├── __root.tsx        # Root layout with FeatureFlagProvider
│       │   │   └── index.tsx         # Home page with feature flag demo UI
│       │   ├── main.tsx              # Application entry point
│       │   ├── index.css             # Global styles (plain CSS)
│       │   └── routeTree.gen.ts      # Auto-generated route tree
│       ├── index.html                # HTML template
│       ├── vite.config.ts            # Vite configuration
│       ├── tsconfig.json             # TypeScript configuration
│       └── package.json              # App dependencies
│
├── packages/
│   └── feature-flags/                # Reusable feature flag library
│       └── src/
│           ├── index.ts              # Public API exports
│           ├── types.ts              # TypeScript type definitions
│           ├── FeatureFlagContext.ts # React context definition
│           ├── FeatureFlagProvider.tsx # Provider component
│           └── useFeatureFlag.ts     # Custom React hooks
│
├── package.json                      # Root workspace configuration
├── pnpm-workspace.yaml               # pnpm workspace definition
├── turbo.json                        # Turborepo pipeline configuration
├── biome.json                        # Biome linter/formatter configuration
├── .node-version                     # Node.js version (for version managers)
├── .gitignore                        # Git ignore rules
└── README.md                         # This file
```

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js 24.13.0** - Use a version manager like [fnm](https://github.com/Schniz/fnm), [nvm](https://github.com/nvm-sh/nvm), or [asdf](https://asdf-vm.com/)
- **pnpm 10.9.0** - Install via `corepack enable` or `npm install -g pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/codenote-net/vite-feature-flag-demo.git
cd vite-feature-flag-demo

# Ensure correct Node.js version (if using fnm)
fnm use

# Enable corepack for pnpm
corepack enable

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173` (or next available port).

### Verify Installation

After starting the dev server, you should see:

1. A "Feature Flag Demo" page with a control panel
2. Three toggleable feature flags: `newDashboard`, `darkMode`, `betaFeature`
3. Real-time UI updates when toggling flags

## Usage

### Feature Flag Package API

The `@demo/feature-flags` package exports the following:

#### Types

```typescript
// Feature flags are a simple key-value map
type FeatureFlags = Record<string, boolean>;

// Context value provided to consumers
type FeatureFlagContextValue = {
  flags: FeatureFlags;
  setFlag: (key: string, value: boolean) => void;
  isEnabled: (key: string) => boolean;
};
```

#### `FeatureFlagProvider`

Wrap your application with this provider to enable feature flags throughout your component tree:

```tsx
import { FeatureFlagProvider } from "@demo/feature-flags";

// Define your initial flag values
const defaultFlags = {
  newDashboard: true,    // Enabled by default
  darkMode: false,       // Disabled by default
  betaFeature: false,    // Disabled by default
};

function App() {
  return (
    <FeatureFlagProvider flags={defaultFlags}>
      <YourApp />
    </FeatureFlagProvider>
  );
}
```

#### `useFeatureFlag(key: string): boolean`

A simple hook to check if a specific feature is enabled:

```tsx
import { useFeatureFlag } from "@demo/feature-flags";

function Dashboard() {
  const isNewDashboardEnabled = useFeatureFlag("newDashboard");

  // Conditionally render based on flag
  if (isNewDashboardEnabled) {
    return <NewDashboard />;
  }
  return <LegacyDashboard />;
}
```

#### `useFeatureFlags(): FeatureFlagContextValue`

Access all flags and control functions for admin panels or debugging:

```tsx
import { useFeatureFlags } from "@demo/feature-flags";

function FeatureFlagDebugPanel() {
  const { flags, setFlag, isEnabled } = useFeatureFlags();

  return (
    <div className="debug-panel">
      <h3>Feature Flags</h3>
      <ul>
        {Object.entries(flags).map(([key, value]) => (
          <li key={key}>
            <label>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setFlag(key, e.target.checked)}
              />
              <span>{key}</span>
              <span className={value ? "badge-on" : "badge-off"}>
                {isEnabled(key) ? "ON" : "OFF"}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Common Patterns

#### Pattern 1: Component Replacement

Replace entire components based on a flag:

```tsx
function MyFeature() {
  const useNewImplementation = useFeatureFlag("newImplementation");

  return useNewImplementation ? <NewComponent /> : <OldComponent />;
}
```

#### Pattern 2: Conditional Rendering

Show or hide specific UI elements:

```tsx
function Header() {
  const showBetaBadge = useFeatureFlag("betaFeature");

  return (
    <header>
      <h1>My App</h1>
      {showBetaBadge && <span className="badge">BETA</span>}
    </header>
  );
}
```

#### Pattern 3: Behavior Modification

Change component behavior without replacing it:

```tsx
function SubmitButton() {
  const useAsyncSubmit = useFeatureFlag("asyncSubmit");

  const handleClick = () => {
    if (useAsyncSubmit) {
      submitAsync();
    } else {
      submitSync();
    }
  };

  return <button onClick={handleClick}>Submit</button>;
}
```

## Implementation Details

### How the Feature Flag Library Works

The feature flag library is built using React's Context API with the following components:

#### 1. Context Creation (`FeatureFlagContext.ts`)

```typescript
import { createContext } from "react";
import type { FeatureFlagContextValue } from "./types";

export const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);
```

#### 2. Provider Component (`FeatureFlagProvider.tsx`)

The provider manages flag state and provides methods to read and update flags:

- Uses `useState` to store the current flag values
- `setFlag` function to update individual flags
- `isEnabled` function to check flag status with a fallback to `false`
- Memoizes the context value to prevent unnecessary re-renders

#### 3. Consumer Hooks (`useFeatureFlag.ts`)

Two hooks for consuming flags:

- `useFeatureFlags()`: Returns the full context (flags, setFlag, isEnabled)
- `useFeatureFlag(key)`: Convenience hook for checking a single flag

### TanStack Router Integration

The project uses TanStack Router with file-based routing:

1. **Route files** in `src/routes/` are automatically discovered
2. **`__root.tsx`** defines the root layout with `FeatureFlagProvider`
3. **`routeTree.gen.ts`** is auto-generated by the Vite plugin

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite development server with hot reload |
| `pnpm build` | Build all packages for production |
| `pnpm lint` | Run Biome linter on all packages |
| `pnpm format` | Format all code with Biome |

### Turborepo Benefits

Running `pnpm dev` or `pnpm build` triggers Turborepo, which:

1. **Analyzes dependencies** between packages
2. **Runs tasks in parallel** where possible
3. **Caches outputs** to skip unchanged packages
4. **Shows a unified log** from all packages

## Architecture Decisions

### Why Custom Feature Flags?

| Consideration | Custom Implementation | Third-Party Service |
|---------------|----------------------|---------------------|
| **Cost** | Free | $50-500+/month |
| **Complexity** | Simple | Complex SDK integration |
| **Control** | Full ownership | Vendor dependency |
| **Features** | Basic (extensible) | Advanced (targeting, analytics) |
| **Latency** | None (client-side) | Network request required |

**Our choice**: Custom implementation for this demo to keep it simple and dependency-free. For production, evaluate your needs.

### Why Monorepo with Turborepo?

- **Code Sharing**: The `@demo/feature-flags` package can be used by multiple apps
- **Consistent Tooling**: Shared Biome, TypeScript, and other configs
- **Atomic Changes**: Update library and consumers in a single PR
- **Caching**: Turborepo skips unchanged packages, speeding up CI/CD

### Why TanStack Router?

- **Type Safety**: Route params, search params, and loaders are fully typed
- **File-Based**: Routes mirror file structure (intuitive organization)
- **Modern Features**: Built-in devtools, code splitting, data loading
- **Active Development**: Regular updates and excellent documentation

### Why Biome over ESLint + Prettier?

- **Speed**: 10-100x faster than ESLint (written in Rust)
- **Simplicity**: Single tool replaces ESLint + Prettier
- **Zero Config**: Sensible defaults out of the box
- **Consistency**: Formatting and linting in one pass

## Production Considerations

This demo is intentionally simple. For production use, consider:

### Flag Persistence

```typescript
// Example: Persist flags to localStorage
const [flags, setFlags] = useState(() => {
  const saved = localStorage.getItem("featureFlags");
  return saved ? JSON.parse(saved) : defaultFlags;
});

useEffect(() => {
  localStorage.setItem("featureFlags", JSON.stringify(flags));
}, [flags]);
```

### Remote Flag Configuration

```typescript
// Example: Load flags from API
useEffect(() => {
  fetch("/api/feature-flags")
    .then((res) => res.json())
    .then((remoteFlags) => setFlags(remoteFlags));
}, []);
```

### User-Based Targeting

```typescript
// Example: Different flags per user
const flags = {
  betaFeature: user.isBetaTester,
  adminPanel: user.role === "admin",
};
```

### Environment-Based Flags

```typescript
// Example: Use environment variables
const flags = {
  debugMode: import.meta.env.DEV,
  newFeature: import.meta.env.VITE_ENABLE_NEW_FEATURE === "true",
};
```

## Security Considerations

### ⚠️ Important: Client-Side Feature Flags Are Not Secure

This implementation uses **client-side feature flags**, which means:

1. **All code is bundled**: Even when a flag is OFF, the protected component code is included in the JavaScript bundle
2. **Flags can be bypassed**: Users can modify React state via browser DevTools to enable any flag
3. **Source code is visible**: With source maps or bundle analysis, anyone can see the "hidden" feature code

```
What users can see (even with flags OFF):
┌─────────────────────────────────────────────────┐
│  Built JavaScript Bundle                        │
│  ├── /admin component code      ← Visible       │
│  ├── /beta component code       ← Visible       │
│  ├── Feature flag logic         ← Visible       │
│  └── All other code             ← Visible       │
└─────────────────────────────────────────────────┘
```

### Protection Levels

| Level | Method | Protects Against | Use Case |
|-------|--------|------------------|----------|
| **1. UI Toggle** (this demo) | Conditional rendering | Casual users | UX experiments, gradual rollouts |
| **2. Lazy Loading** | `React.lazy()` + dynamic import | Casual code inspection | Slightly better, but URL still accessible |
| **3. Server-Side Auth** | API authorization checks | Unauthorized data access | **Required for sensitive data** |
| **4. Build-Time Exclusion** | Environment variables at build | Code exposure | Separate builds per environment |

### Recommended Architecture for Production

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Side                          │
│  Feature flags control UI visibility only (UX purpose)      │
│  ⚠️ NOT for security - assume all client code is public     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Server Side                          │
│  ✓ Authentication: Verify user identity                     │
│  ✓ Authorization: Check permissions for each request        │
│  ✓ Feature flags: Evaluate server-side before returning     │
│  ✓ Data filtering: Only return allowed data                 │
└─────────────────────────────────────────────────────────────┘
```

### Code Example: Secure Pattern

```typescript
// ❌ INSECURE: Client-side only check
function AdminPage() {
  const hasAccess = useFeatureFlag("adminAccess");
  if (!hasAccess) return <AccessDenied />;

  // This code is in the bundle and API is unprotected!
  const data = await fetch("/api/admin/users");
  return <UserList data={data} />;
}

// ✅ SECURE: Server validates every request
function AdminPage() {
  const hasAccess = useFeatureFlag("adminAccess");
  if (!hasAccess) return <AccessDenied />;

  // Server checks auth token and permissions
  const data = await fetch("/api/admin/users", {
    headers: { Authorization: `Bearer ${token}` }
  });
  // Server returns 403 if unauthorized, regardless of client flag
  return <UserList data={data} />;
}
```

### When Client-Side Flags Are Appropriate

- ✅ A/B testing UI variations
- ✅ Gradual rollout of UI changes
- ✅ Beta feature previews (non-sensitive)
- ✅ Dark mode, theme toggles
- ✅ UI layout experiments

### When You Need Server-Side Protection

- ❌ Admin panels with sensitive data
- ❌ Premium/paid features
- ❌ User data access controls
- ❌ Any feature with security implications

## Future Enhancements

Potential improvements for production use:

- [ ] **Persist flags to localStorage** - Retain user preferences across sessions
- [ ] **Load flags from remote API** - Centralized flag management
- [ ] **User-based targeting** - Enable features for specific users/groups
- [ ] **Percentage rollouts** - Gradually release to X% of users
- [ ] **A/B testing support** - Track which variant users see
- [ ] **Flag change analytics** - Monitor flag usage and impact
- [ ] **Server-side evaluation** - Prevent flag exposure in client bundle
- [ ] **Flag expiration** - Automatically clean up old flags
- [ ] **TypeScript strict flag keys** - Compile-time validation of flag names

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run linting: `pnpm lint`
5. Format code: `pnpm format`
6. Commit with a descriptive message
7. Push and create a Pull Request

### Development Guidelines

- Follow the existing code style (enforced by Biome)
- Add TypeScript types for all new code
- Keep the feature flag library dependency-free (React only)
- Update README.md for significant changes

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with [Vite](https://vitejs.dev/) | [React](https://react.dev/) | [TanStack Router](https://tanstack.com/router) | [Turborepo](https://turbo.build/)
