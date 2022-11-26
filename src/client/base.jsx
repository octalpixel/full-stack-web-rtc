import {
	StrictMode,
	Suspense,
} from 'react';

import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import App from './App';
import { AuthenticationProvider } from './contexts/user';
import { PreferencesProvider } from './contexts/preferences';

const Router = import.meta.env.SSR
	? StaticRouter
	: BrowserRouter;

export function createApp(ctx, url) {
	return (
		<StrictMode>
			<Suspense>
				<Router location={url}>
					<AuthenticationProvider>
						<PreferencesProvider>
							<App />
						</PreferencesProvider>
					</AuthenticationProvider>
				</Router>
			</Suspense>
		</StrictMode>
	);
}
