const calc = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

let defaultDark = calc();

setInterval(() => {
	defaultDark = calc();

	if (!localStorage.dark) {
		loadThemeInner(defaultDark);
	}
}, 1 * 1000);

export function loadTheme() {
	try {
		const dark = JSON.parse(
			localStorage.dark || defaultDark ? 'true' : 'false',
		) as boolean;
		loadThemeInner(dark);
	} catch {
		loadThemeInner(defaultDark);
	}
}

const loadThemeInner = (dark: boolean) =>
	document.body.classList.toggle('dark', dark);
