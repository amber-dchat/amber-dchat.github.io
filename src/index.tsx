import { loadTheme } from './utils/theme';

loadTheme();

import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import App from '@app';

const rootEl = document.getElementById('root');
if (rootEl) {
	const root = ReactDOM.createRoot(rootEl);
	root.render(
		<React.Fragment>
			<input type="file" id="avatar" accept="image/*" multiple={false} hidden />
			<App />
		</React.Fragment>,
	);
}
