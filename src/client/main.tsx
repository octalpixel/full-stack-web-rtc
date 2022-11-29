import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { UserProvider } from './contexts/user';

createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<UserProvider>
			<App />
		</UserProvider>
	</React.StrictMode>,
);

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js');
}
