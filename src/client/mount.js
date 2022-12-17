import { hydrateRoot } from 'react-dom/client';

import { createApp } from './base.tsx';

hydrateRoot(
	document.querySelector('#root'),
	createApp(
		window.hydration,
		window.location.pathname,
	),
);
