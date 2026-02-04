/**
 * Environment variable-based feature flags
 *
 * In Vite, environment variables must be prefixed with VITE_ to be exposed to the client.
 * Feature flags should follow the naming convention: VITE_FF_<FLAG_NAME>
 *
 * Example:
 *   VITE_FF_NEW_DASHBOARD=true
 *   VITE_FF_DARK_MODE=false
 */

type EnvFlagOptions = {
	/**
	 * Prefix for feature flag environment variables
	 * @default "VITE_FF_"
	 */
	prefix?: string;
	/**
	 * Environment variables object (for testing or custom sources)
	 * @default import.meta.env
	 */
	env?: Record<string, string | boolean | undefined>;
};

/**
 * Parse a string value to boolean
 */
function parseBoolean(value: string | boolean | undefined): boolean {
	if (typeof value === "boolean") return value;
	if (value === undefined || value === "") return false;
	return value.toLowerCase() === "true" || value === "1";
}

/**
 * Convert SCREAMING_SNAKE_CASE to camelCase
 * Example: NEW_DASHBOARD -> newDashboard
 */
function toCamelCase(str: string): string {
	return str
		.toLowerCase()
		.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Get all feature flags from environment variables
 *
 * @example
 * // .env file:
 * // VITE_FF_NEW_DASHBOARD=true
 * // VITE_FF_DARK_MODE=false
 *
 * const flags = getEnvFlags();
 * // { newDashboard: true, darkMode: false }
 */
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

/**
 * Check if a specific feature flag is enabled via environment variable
 *
 * @example
 * // .env file:
 * // VITE_FF_NEW_DASHBOARD=true
 *
 * isEnvFlagEnabled("newDashboard"); // true
 * isEnvFlagEnabled("unknownFlag");  // false
 */
export function isEnvFlagEnabled(
	flagName: string,
	options: EnvFlagOptions = {},
): boolean {
	const flags = getEnvFlags(options);
	return flags[flagName] ?? false;
}

/**
 * Get raw environment variable information for debugging
 */
export function getEnvFlagDebugInfo(options: EnvFlagOptions = {}): {
	prefix: string;
	rawValues: Record<string, string | boolean | undefined>;
	parsedFlags: Record<string, boolean>;
} {
	const { prefix = "VITE_FF_", env = import.meta.env } = options;

	const rawValues: Record<string, string | boolean | undefined> = {};
	for (const [key, value] of Object.entries(env)) {
		if (key.startsWith(prefix)) {
			rawValues[key] = value;
		}
	}

	return {
		prefix,
		rawValues,
		parsedFlags: getEnvFlags(options),
	};
}
