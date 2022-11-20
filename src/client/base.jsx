import { StrictMode } from 'react';

import App from './App';
import { AuthenticationProvider } from './contexts/authentication';
import { PreferencesProvider } from './contexts/preferences';

export function createApp() {
	return (
		<StrictMode>
			<PreferencesProvider>
				<AuthenticationProvider>
					<App />
				</AuthenticationProvider>
			</PreferencesProvider>
		</StrictMode>
	);
}
