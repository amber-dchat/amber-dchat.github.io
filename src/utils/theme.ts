const calc = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

let defaultDark = calc();

setInterval(() => {
	defaultDark = calc();

	if (!localStorage.dark) {
		loadThemeInner(defaultDark);
	}
}, 10 * 1000);

export function loadTheme() {
	try {
		const dark = calcDark();

		loadThemeInner(dark);
	} catch (e) {
		console.log(e);
		loadThemeInner(defaultDark);
	}
}

export const calcDark = () =>
	JSON.parse(localStorage.dark || (defaultDark ? 'true' : 'false')) as boolean;

export const getTheme = () => {
	try {
		return localStorage.dark ? localStorage.dark : 'system';
	} catch {
		return 'system';
	}
};

export const setTheme = (theme: string) => {
	if (theme == 'system') {
		localStorage.removeItem('dark');
	} else {
		localStorage.dark = theme;
	}

	loadTheme();
};

const loadThemeInner = (dark: boolean) =>
	document.body.classList.toggle('dark', dark);
