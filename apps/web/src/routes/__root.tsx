import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { FeatureFlagProvider, useFeatureFlag } from "@demo/feature-flags";

const defaultFlags = {
  newDashboard: true,
  darkMode: false,
  betaFeature: false,
  adminAccess: false,
};

function Navigation() {
  const hasAdminAccess = useFeatureFlag("adminAccess");
  const hasBetaAccess = useFeatureFlag("betaFeature");

  return (
    <nav className="nav">
      <Link to="/" className="nav-link">
        Home
      </Link>
      <Link to="/admin" className="nav-link" data-disabled={!hasAdminAccess}>
        Admin {!hasAdminAccess && "(Locked)"}
      </Link>
      <Link to="/beta" className="nav-link" data-disabled={!hasBetaAccess}>
        Beta {!hasBetaAccess && "(Locked)"}
      </Link>
      <Link to="/public" className="nav-link">
        Public
      </Link>
    </nav>
  );
}

function RootLayout() {
  return (
    <FeatureFlagProvider flags={defaultFlags}>
      <div className="app">
        <header className="header">
          <h1 className="header-title">Vite Feature Flag Demo</h1>
          <Navigation />
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </FeatureFlagProvider>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
