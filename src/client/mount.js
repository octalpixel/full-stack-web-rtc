import { hydrateRoot } from 'react-dom/client';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createApp } from './base';

hydrateRoot(
	// eslint-disable-next-line no-undef
	document.querySelector('#root'),
	// eslint-disable-next-line no-undef
	createApp(window.hydration),
);
