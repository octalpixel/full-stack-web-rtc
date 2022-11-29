import {
	StrictMode,
	Suspense,
} from 'react';

import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import App from './App';
import { PreferencesProvider } from './contexts/preferences';
import { UserProvider } from './contexts/user';

const Router = import.meta.env.SSR
	? StaticRouter
	: BrowserRouter;

export function createApp(ctx, url) {
	return (
		<StrictMode>
			<Suspense>
				<Router location={url}>
					<UserProvider>
						<PreferencesProvider>
							<App />
						</PreferencesProvider>
					</UserProvider>
				</Router>
			</Suspense>
		</StrictMode>
	);
}
