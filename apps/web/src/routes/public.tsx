import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/public")({
  component: PublicPage,
});

function PublicPage() {
  return (
    <div className="container">
      <section className="feature-card">
        <h2>Public Page</h2>
        <div className="public-content">
          <p className="public-message">
            <span className="public-icon">🌐</span>
            This page is always accessible!
          </p>

          <p>
            No feature flag is required to view this page. It serves as a baseline
            to compare with the protected <code>/admin</code> and <code>/beta</code> routes.
          </p>

          <h3>Why Public Pages Matter</h3>
          <p>
            In a real application, you would have a mix of:
          </p>
          <ul className="info-list">
            <li><strong>Public routes</strong> - Accessible to everyone (landing page, docs, pricing)</li>
            <li><strong>Protected routes</strong> - Require authentication or specific permissions</li>
            <li><strong>Feature-flagged routes</strong> - Rolled out gradually or to specific user groups</li>
          </ul>

          <div className="highlight-box">
            <h4>Route Access Summary</h4>
            <table className="access-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Flag Required</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>/</code></td>
                  <td>None</td>
                  <td><span className="badge badge-enabled">Open</span></td>
                </tr>
                <tr>
                  <td><code>/public</code></td>
                  <td>None</td>
                  <td><span className="badge badge-enabled">Open</span></td>
                </tr>
                <tr>
                  <td><code>/admin</code></td>
                  <td><code>adminAccess</code></td>
                  <td><span className="badge badge-disabled">Protected</span></td>
                </tr>
                <tr>
                  <td><code>/beta</code></td>
                  <td><code>betaFeature</code></td>
                  <td><span className="badge badge-disabled">Protected</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
