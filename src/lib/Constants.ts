export const TIMEOUT_DELAY = 10_000 as const;
export const formatDataStores = (d: string, type: 'chat') =>
	`dchatt-app-platform/${type}/${d}`;
