import {
	StrictMode,
	Suspense,
} from 'react';

import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import App from './App';
import { AuthenticationProvider } from './contexts/authentication';
import { PreferencesProvider } from './contexts/preferences';

const Router = import.meta.env.SSR
	? StaticRouter
	: BrowserRouter;

export function createApp(ctx, url) {
	return (
		<StrictMode>
			{/* <BrowserRouter> */}
			<Suspense>
				<Router location={url}>
					<PreferencesProvider>
						<AuthenticationProvider>
							<App />
						</AuthenticationProvider>
					</PreferencesProvider>
				</Router>
			</Suspense>
			{/* </BrowserRouter> */}
		</StrictMode>
	);
}
