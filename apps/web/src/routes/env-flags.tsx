import {
	getEnvFlags,
	getEnvFlagDebugInfo,
	isEnvFlagEnabled,
} from "@demo/feature-flags";
import { createFileRoute } from "@tanstack/react-router";

function EnvFlagsDemo() {
	const flags = getEnvFlags();
	const debugInfo = getEnvFlagDebugInfo();

	return (
		<div className="page">
			<h2>Environment Variable Feature Flags</h2>
			<p className="description">
				This demo shows feature flags loaded from environment variables at build
				time. These flags are read-only and cannot be changed at runtime.
			</p>

			<section className="card">
				<h3>How It Works</h3>
				<ol className="list">
					<li>
						Define flags in <code>.env</code> file with{" "}
						<code>VITE_FF_</code> prefix
					</li>
					<li>
						Vite embeds these values at build time via{" "}
						<code>import.meta.env</code>
					</li>
					<li>
						Use <code>getEnvFlags()</code> to retrieve all flags as an object
					</li>
					<li>
						Use <code>isEnvFlagEnabled("flagName")</code> to check specific
						flags
					</li>
				</ol>
			</section>

			<section className="card">
				<h3>Current Environment Flags</h3>
				<table className="flag-table">
					<thead>
						<tr>
							<th>Flag Name</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(flags).map(([key, value]) => (
							<tr key={key}>
								<td>
									<code>{key}</code>
								</td>
								<td>
									<span className={`badge ${value ? "badge-on" : "badge-off"}`}>
										{value ? "Enabled" : "Disabled"}
									</span>
								</td>
							</tr>
						))}
						{Object.keys(flags).length === 0 && (
							<tr>
								<td colSpan={2} className="text-muted">
									No environment flags found. Add VITE_FF_* variables to .env
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</section>

			<section className="card">
				<h3>Usage Examples</h3>
				<div className="example-grid">
					<div className="example">
						<h4>Experimental Checkout</h4>
						{isEnvFlagEnabled("experimentalCheckout") ? (
							<div className="feature-enabled">
								<span className="icon">✓</span>
								New checkout experience is active
							</div>
						) : (
							<div className="feature-disabled">
								<span className="icon">×</span>
								Classic checkout is active
							</div>
						)}
					</div>

					<div className="example">
						<h4>Analytics Dashboard</h4>
						{isEnvFlagEnabled("analyticsDashboard") ? (
							<div className="feature-enabled">
								<span className="icon">✓</span>
								Analytics dashboard available
							</div>
						) : (
							<div className="feature-disabled">
								<span className="icon">×</span>
								Analytics dashboard hidden
							</div>
						)}
					</div>

					<div className="example">
						<h4>Maintenance Mode</h4>
						{isEnvFlagEnabled("maintenanceMode") ? (
							<div className="feature-warning">
								<span className="icon">⚠</span>
								System is in maintenance mode
							</div>
						) : (
							<div className="feature-enabled">
								<span className="icon">✓</span>
								System is operational
							</div>
						)}
					</div>
				</div>
			</section>

			<section className="card">
				<h3>Debug Information</h3>
				<details>
					<summary>View raw environment data</summary>
					<pre className="debug-output">
						{JSON.stringify(debugInfo, null, 2)}
					</pre>
				</details>
			</section>

			<section className="card">
				<h3>Code Example</h3>
				<pre className="code-block">
					{`// .env file
VITE_FF_EXPERIMENTAL_CHECKOUT=true
VITE_FF_ANALYTICS_DASHBOARD=true

// Usage in code
import { getEnvFlags, isEnvFlagEnabled } from "@demo/feature-flags";

// Get all flags
const flags = getEnvFlags();
// { experimentalCheckout: true, analyticsDashboard: true }

// Check specific flag
if (isEnvFlagEnabled("experimentalCheckout")) {
  return <NewCheckout />;
}
return <ClassicCheckout />;`}
				</pre>
			</section>

			<section className="card card-info">
				<h3>When to Use Environment Variable Flags</h3>
				<ul className="list">
					<li>
						<strong>Build-time configuration:</strong> Flags that differ between
						environments (dev, staging, prod)
					</li>
					<li>
						<strong>CI/CD integration:</strong> Enable/disable features per
						deployment
					</li>
					<li>
						<strong>Simple on/off toggles:</strong> No need for runtime changes
						or user-specific targeting
					</li>
					<li>
						<strong>Secret-free flags:</strong> Values are embedded in the
						bundle (don't use for secrets!)
					</li>
				</ul>
			</section>
		</div>
	);
}

export const Route = createFileRoute("/env-flags")({
	component: EnvFlagsDemo,
});
