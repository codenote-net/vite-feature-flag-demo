import { createFileRoute } from "@tanstack/react-router";
import { useFeatureFlag, useFeatureFlags } from "@demo/feature-flags";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { flags, setFlag } = useFeatureFlags();
  const isNewDashboardEnabled = useFeatureFlag("newDashboard");
  const isDarkModeEnabled = useFeatureFlag("darkMode");

  return (
    <div className="container">
      <section className="feature-card">
        <h2>Feature Flags Control Panel</h2>
        <p>Toggle features on/off to see how they affect the application:</p>
        <ul className="flag-list">
          {Object.entries(flags).map(([key, value]) => (
            <li key={key} className="flag-item">
              <label className="flag-label">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setFlag(key, e.target.checked)}
                  className="flag-checkbox"
                />
                <span className="flag-name">{key}</span>
                <span className={`badge ${value ? "badge-enabled" : "badge-disabled"}`}>
                  {value ? "ON" : "OFF"}
                </span>
              </label>
              <FlagDescription flagKey={key} />
            </li>
          ))}
        </ul>
      </section>

      <section className="feature-card">
        <h2>UI Feature: New Dashboard</h2>
        {isNewDashboardEnabled ? (
          <div className="demo-box demo-box-enabled">
            <p>New dashboard is enabled! Here is the new UI.</p>
          </div>
        ) : (
          <div className="demo-box demo-box-disabled">
            <p>Using legacy dashboard.</p>
          </div>
        )}
      </section>

      <section className="feature-card">
        <h2>UI Feature: Dark Mode</h2>
        {isDarkModeEnabled ? (
          <div className="demo-box demo-box-dark">
            <p>Dark mode is enabled!</p>
          </div>
        ) : (
          <div className="demo-box">
            <p>Light mode (default).</p>
          </div>
        )}
      </section>

      <section className="feature-card">
        <h2>Route Access Control</h2>
        <p>
          Try enabling <strong>adminAccess</strong> and <strong>betaFeature</strong> flags above,
          then navigate to the Admin and Beta pages using the navigation bar.
        </p>
        <ul className="info-list">
          <li><strong>/admin</strong> - Requires <code>adminAccess</code> flag</li>
          <li><strong>/beta</strong> - Requires <code>betaFeature</code> flag</li>
          <li><strong>/public</strong> - Always accessible (no flag required)</li>
        </ul>
      </section>
    </div>
  );
}

function FlagDescription({ flagKey }: { flagKey: string }) {
  const descriptions: Record<string, string> = {
    newDashboard: "Toggles between new and legacy dashboard UI",
    darkMode: "Enables dark mode styling",
    betaFeature: "Grants access to /beta route",
    adminAccess: "Grants access to /admin route",
  };

  return (
    <span className="flag-description">{descriptions[flagKey] || ""}</span>
  );
}
