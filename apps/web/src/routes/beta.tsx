import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useFeatureFlag } from "@demo/feature-flags";

export const Route = createFileRoute("/beta")({
  component: BetaPage,
});

function BetaPage() {
  const hasBetaAccess = useFeatureFlag("betaFeature");
  const navigate = useNavigate();

  if (!hasBetaAccess) {
    return (
      <div className="container">
        <section className="feature-card access-denied">
          <h2>Beta Access Required</h2>
          <div className="access-denied-content">
            <span className="access-denied-icon">🧪</span>
            <p>
              This feature is currently in beta testing.
            </p>
            <p className="access-denied-hint">
              Enable the <code>betaFeature</code> flag to preview this page.
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
        <h2>Beta Features</h2>
        <div className="beta-content">
          <p className="beta-message">
            <span className="beta-icon">🧪</span>
            Welcome to the beta program!
          </p>

          <p>
            You're seeing experimental features that are still in development.
            Your feedback helps us improve!
          </p>

          <h3>New Experimental Features</h3>
          <ul className="beta-features-list">
            <li>
              <span className="feature-status new">NEW</span>
              AI-powered suggestions
            </li>
            <li>
              <span className="feature-status new">NEW</span>
              Advanced analytics dashboard
            </li>
            <li>
              <span className="feature-status wip">WIP</span>
              Real-time collaboration
            </li>
            <li>
              <span className="feature-status wip">WIP</span>
              Custom theme builder
            </li>
          </ul>

          <div className="feedback-box">
            <h4>Send Feedback</h4>
            <textarea
              placeholder="Tell us what you think about these beta features..."
              rows={3}
              className="feedback-input"
            />
            <button type="button" className="btn btn-primary">
              Submit Feedback
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
