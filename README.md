# Vite Feature Flag Demo

A comprehensive demonstration project for implementing custom feature flags in a React application using Vite, TypeScript, and TanStack Router. This project serves as a proof of concept for trunk-based development workflows.

## Table of Contents

- [Overview](#overview)
- [What are Feature Flags?](#what-are-feature-flags)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Pattern 1: React Context (Runtime)](#pattern-1-react-context-runtime)
  - [Pattern 2: Environment Variables (Build-time)](#pattern-2-environment-variables-build-time)
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
│       │   │   ├── index.tsx         # Home page with feature flag demo UI
│       │   │   └── env-flags.tsx     # Environment variable pattern demo
│       │   ├── main.tsx              # Application entry point
│       │   ├── index.css             # Global styles (plain CSS)
│       │   └── routeTree.gen.ts      # Auto-generated route tree
│       ├── .env                      # Environment variables (git-ignored)
│       ├── .env.example              # Example environment variables
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
│           ├── useFeatureFlag.ts     # Custom React hooks
│           └── envFlags.ts           # Environment variable utilities
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

# Set up environment variables (optional, for env flag demo)
cp apps/web/.env.example apps/web/.env

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173` (or next available port).

### Verify Installation

After starting the dev server, you should see:

1. A "Feature Flag Demo" page with a control panel
2. Four toggleable feature flags: `newDashboard`, `darkMode`, `betaFeature`, `adminAccess`
3. Real-time UI updates when toggling flags
4. Navigation links: Home, Admin, Beta, Public, **Env Flags**
5. The "Env Flags" page showing environment variable-based flags

## Usage

This project demonstrates **two distinct patterns** for implementing feature flags:

| Pattern | Control | Best For |
|---------|---------|----------|
| **React Context (Runtime)** | Changeable at runtime | User-specific flags, A/B testing, dynamic toggles |
| **Environment Variables (Build-time)** | Fixed at build time | Environment-specific flags, CI/CD integration |

---

### Pattern 1: React Context (Runtime)

This pattern uses React Context API to manage feature flags that can be changed at runtime.

#### Feature Flag Package API

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

---

### Pattern 2: Environment Variables (Build-time)

This pattern uses Vite's environment variables to define feature flags that are embedded at build time. These flags cannot be changed at runtime.

#### Setup

1. **Create `.env` file** in `apps/web/`:

```bash
# Feature flags must be prefixed with VITE_FF_
VITE_FF_EXPERIMENTAL_CHECKOUT=true
VITE_FF_ANALYTICS_DASHBOARD=true
VITE_FF_AB_TEST_VARIANT=false
VITE_FF_MAINTENANCE_MODE=false
```

2. **Copy `.env.example` as a template** (committed to git):

```bash
cp apps/web/.env.example apps/web/.env
```

> **Note**: `.env` is git-ignored to prevent accidental commits of environment-specific values.

#### API

##### `getEnvFlags(): Record<string, boolean>`

Get all feature flags from environment variables:

```typescript
import { getEnvFlags } from "@demo/feature-flags";

const flags = getEnvFlags();
// { experimentalCheckout: true, analyticsDashboard: true, abTestVariant: false, maintenanceMode: false }
```

##### `isEnvFlagEnabled(flagName: string): boolean`

Check if a specific flag is enabled:

```typescript
import { isEnvFlagEnabled } from "@demo/feature-flags";

if (isEnvFlagEnabled("experimentalCheckout")) {
  return <NewCheckout />;
}
return <ClassicCheckout />;
```

##### `getEnvFlagDebugInfo(): object`

Get debug information including raw environment values:

```typescript
import { getEnvFlagDebugInfo } from "@demo/feature-flags";

const debug = getEnvFlagDebugInfo();
// {
//   prefix: "VITE_FF_",
//   rawValues: { "VITE_FF_EXPERIMENTAL_CHECKOUT": "true", ... },
//   parsedFlags: { experimentalCheckout: true, ... }
// }
```

#### Naming Convention

| Environment Variable | Parsed Flag Name |
|---------------------|------------------|
| `VITE_FF_NEW_DASHBOARD` | `newDashboard` |
| `VITE_FF_DARK_MODE` | `darkMode` |
| `VITE_FF_AB_TEST_VARIANT` | `abTestVariant` |

- Prefix: `VITE_FF_` (required for Vite to expose to client)
- Format: `SCREAMING_SNAKE_CASE` → converted to `camelCase`
- Values: `"true"` or `"false"` (case-insensitive)

#### Usage Example

```tsx
import { isEnvFlagEnabled } from "@demo/feature-flags";

function App() {
  // Check maintenance mode
  if (isEnvFlagEnabled("maintenanceMode")) {
    return <MaintenancePage />;
  }

  return (
    <div>
      {/* Conditional feature based on env flag */}
      {isEnvFlagEnabled("analyticsDashboard") && <AnalyticsDashboard />}

      {/* A/B test variant */}
      {isEnvFlagEnabled("abTestVariant") ? <VariantB /> : <VariantA />}
    </div>
  );
}
```

#### When to Use Environment Variable Flags

| Use Case | Recommended |
|----------|-------------|
| Different config per environment (dev/staging/prod) | Yes |
| CI/CD pipeline feature toggles | Yes |
| Simple on/off toggles without runtime changes | Yes |
| User-specific or session-specific flags | No (use React Context) |
| Flags that need to change without redeployment | No (use React Context) |
| Sensitive configuration | No (values are bundled) |

#### Per-Environment Configuration

```bash
# .env.development
VITE_FF_DEBUG_MODE=true
VITE_FF_MOCK_API=true

# .env.production
VITE_FF_DEBUG_MODE=false
VITE_FF_MOCK_API=false

# .env.staging
VITE_FF_DEBUG_MODE=true
VITE_FF_MOCK_API=false
```

---

### Comparison: Runtime vs Build-time Flags

| Aspect | React Context (Runtime) | Environment Variables (Build-time) |
|--------|------------------------|-----------------------------------|
| **When resolved** | Runtime (in browser) | Build time (during `vite build`) |
| **Can change without rebuild** | Yes | No |
| **User-specific targeting** | Yes | No |
| **Environment-specific** | Possible but complex | Native support |
| **Bundle size impact** | Minimal | None (dead code elimination) |
| **DevTools visibility** | State visible in React DevTools | Values embedded in bundle |
| **Typical use case** | A/B testing, gradual rollouts | Dev/prod differences, CI/CD |

#### Combining Both Patterns

You can use both patterns together for maximum flexibility:

```tsx
import { useFeatureFlag, isEnvFlagEnabled } from "@demo/feature-flags";

function MyComponent() {
  // Build-time flag: Is this feature available in this environment?
  const isFeatureAvailable = isEnvFlagEnabled("newFeature");

  // Runtime flag: Is this user enrolled in the feature?
  const isUserEnrolled = useFeatureFlag("newFeatureRollout");

  // Both must be true
  if (isFeatureAvailable && isUserEnrolled) {
    return <NewFeature />;
  }
  return <LegacyFeature />;
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

### Environment Variable Flag Implementation (`envFlags.ts`)

The environment variable pattern is implemented with three main functions:

#### 1. Parsing Logic

```typescript
// Convert "true"/"false" strings to boolean
function parseBoolean(value: string | boolean | undefined): boolean {
  if (typeof value === "boolean") return value;
  if (value === undefined || value === "") return false;
  return value.toLowerCase() === "true" || value === "1";
}

// Convert SCREAMING_SNAKE_CASE to camelCase
function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
```

#### 2. Flag Extraction

```typescript
export function getEnvFlags(options: EnvFlagOptions = {}): Record<string, boolean> {
  const { prefix = "VITE_FF_", env = import.meta.env } = options;

  const flags: Record<string, boolean> = {};

  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith(prefix)) {
      const flagName = toCamelCase(key.slice(prefix.length));
      flags[flagName] = parseBoolean(value);
    }
  }

  return flags;
}
```

#### 3. How Vite Handles Environment Variables

Vite replaces `import.meta.env.VITE_*` at build time:

```javascript
// Source code
if (import.meta.env.VITE_FF_DEBUG === "true") { ... }

// After build (production)
if ("false" === "true") { ... }  // Dead code, removed by minifier
```

This means:
- **No runtime overhead**: Values are inlined as strings
- **Dead code elimination**: Disabled features are removed from bundle
- **No secrets**: All `VITE_*` values are embedded in client bundle

### TanStack Router Integration

The project uses TanStack Router with file-based routing:

1. **Route files** in `src/routes/` are automatically discovered
2. **`__root.tsx`** defines the root layout with `FeatureFlagProvider`
3. **`routeTree.gen.ts`** is auto-generated by the Vite plugin
4. **`env-flags.tsx`** demonstrates the environment variable pattern

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
- [x] **Environment variable flags** - Build-time feature flags via `VITE_FF_*`
- [ ] **Hybrid flag system** - Combine runtime and build-time flags with priority rules

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
