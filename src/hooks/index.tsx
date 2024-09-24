import { useEffect, useRef, useState } from 'react';

import { Loading } from './loading';
import NotFound from './404';

type Cache = { [key: string]: JSX.Element };

declare global {
	type PopStatefulEvent = Omit<PopStateEvent, 'state'> & {
		state: {
			pathname: string;
			search: string;
		};
	};
}

const promisify =
	(e: () => Promise<{ default: () => React.JSX.Element }>) => () =>
		e().then(({ default: R }) => <R />);

const imports: { [key: string]: () => Promise<React.JSX.Element> } = {
	'/': promisify(() => import('@/routes/landing/index')),
};

const delay = (ms: number) => new Promise((r) => setTimeout(() => r(null), ms));

const callbacks: ((data: { pathname: string; query: string }) => void)[] = [];

export function usePage() {
	const [page, setPage] = useState(<Loading />);
	const [pathname, setPathname] = useState(window.location.pathname);
	const cache = useRef<Cache>({});

	useEffect(() => {
		window.addEventListener('popstate', (event: PopStatefulEvent) => {
			console.log('pop state', event.state);
			setPathname(event.state?.pathname || '/');
		});
		callbacks.push(({ pathname }) => {
			setPathname(pathname);
		});
	}, []);

	useEffect(() => {
		(async () => {
			if (cache.current[pathname]) {
				setPage(<Loading />);
				await delay(300);
				setPage(cache.current[pathname]);
				return;
			}

			if (!imports[pathname]) {
				setPage(<NotFound />);
				return;
			}

			setPage(<Loading />);

			const jsx = await imports[pathname]();

			await delay(300);
			setPage(jsx);
			cache.current[pathname] = jsx;
		})();
	}, [pathname, cache]);

	return page;
}

export interface PageData {
	search: URLSearchParams;
}

export function usePageData(): PageData {
	const [data, setData] = useState<PageData>({
		search: new URLSearchParams(window.location.search),
	});

	useEffect(() => {
		window.addEventListener('popstate', (event: PopStatefulEvent) => {
			console.log('pop state 2', event.state);
			if (event.state)
				setData({
					search: new URLSearchParams(event.state?.search),
				});
		});

		const id = callbacks.push(({ query }) => {
			setData({
				search: new URLSearchParams(query),
			});
		});

		return () => {
			callbacks.splice(id, 1);
		};
	}, []);

	return data;
}

export function navigate(path: string) {
	const url = new URL(path, window.location.origin);
	window.history.pushState(
		{
			pathname: url.pathname || '/',
			search: url.search,
		},
		'',
		url,
	);

	callbacks.forEach((v) =>
		v({ pathname: url.pathname || '/', query: url.search }),
	);
}
