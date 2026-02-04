import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useFeatureFlag } from "@demo/feature-flags";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const hasAdminAccess = useFeatureFlag("adminAccess");
  const navigate = useNavigate();

  if (!hasAdminAccess) {
    return (
      <div className="container">
        <section className="feature-card access-denied">
          <h2>Access Denied</h2>
          <div className="access-denied-content">
            <span className="access-denied-icon">🔒</span>
            <p>
              You don't have permission to access this page.
            </p>
            <p className="access-denied-hint">
              Enable the <code>adminAccess</code> flag to unlock this page.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate({ to: "/" })}
            >
              Go to Home
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="feature-card">
        <h2>Admin Dashboard</h2>
        <div className="admin-content">
          <p className="success-message">
            <span className="success-icon">✓</span>
            You have admin access!
          </p>

          <div className="admin-stats">
            <div className="stat-card">
              <span className="stat-value">1,234</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">567</span>
              <span className="stat-label">Active Sessions</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">89%</span>
              <span className="stat-label">System Health</span>
            </div>
          </div>

          <h3>Admin Actions</h3>
          <div className="admin-actions">
            <button type="button" className="btn">Manage Users</button>
            <button type="button" className="btn">View Logs</button>
            <button type="button" className="btn">System Settings</button>
          </div>
        </div>
      </section>
    </div>
  );
}
