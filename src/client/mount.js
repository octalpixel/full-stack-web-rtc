import { hydrateRoot } from 'react-dom/client';

import { createApp } from './base';

hydrateRoot(
	// eslint-disable-next-line no-undef
	document.querySelector('#root'),
	// eslint-disable-next-line no-undef
	createApp(window.hydration),
);
