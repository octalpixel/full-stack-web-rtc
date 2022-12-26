import { hydrateRoot } from 'react-dom/client';

import { createApp } from './base.tsx';

hydrateRoot(
	// eslint-disable-next-line no-undef
	document.querySelector('#root'),
	createApp(
		// eslint-disable-next-line no-undef
		window.hydration,
		// eslint-disable-next-line no-undef
		window.location.pathname,
	),
);
