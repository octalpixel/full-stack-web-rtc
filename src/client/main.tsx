import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);

if ('serviceWorker' in navigator) {
	(async () => {
		navigator.serviceWorker.register('/service-worker.js');
	})();
}
