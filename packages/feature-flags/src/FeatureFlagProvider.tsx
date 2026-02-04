import { type ReactNode, useCallback, useMemo, useState } from "react";
import { FeatureFlagContext } from "./FeatureFlagContext";
import type { FeatureFlagContextValue, FeatureFlags } from "./types";

type FeatureFlagProviderProps = {
	children: ReactNode;
	flags: FeatureFlags;
};

export function FeatureFlagProvider({
	children,
	flags: initialFlags,
}: FeatureFlagProviderProps) {
	const [flags, setFlags] = useState<FeatureFlags>(initialFlags);

	const setFlag = useCallback((key: string, value: boolean) => {
		setFlags((prev) => ({ ...prev, [key]: value }));
	}, []);

	const isEnabled = useCallback(
		(key: string) => {
			return flags[key] ?? false;
		},
		[flags],
	);

	const value: FeatureFlagContextValue = useMemo(
		() => ({
			flags,
			setFlag,
			isEnabled,
		}),
		[flags, setFlag, isEnabled],
	);

	return (
		<FeatureFlagContext.Provider value={value}>
			{children}
		</FeatureFlagContext.Provider>
	);
}
