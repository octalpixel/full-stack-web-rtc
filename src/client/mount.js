import { hydrateRoot } from 'react-dom/client';

import { createApp } from './base';

hydrateRoot(
	// eslint-disable-next-line no-undef
	document.querySelector('main'),
	// eslint-disable-next-line no-undef
	createApp(window.hydration),
);
