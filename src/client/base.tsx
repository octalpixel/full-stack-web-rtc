import {
	StrictMode,
	Suspense,
} from 'react';

import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import App from './App';

const Router = import.meta.env.SSR
	? StaticRouter
	: BrowserRouter;

export function createApp(ctx: unknown, url: string) {
	return (
		<StrictMode>
			<Suspense>
				<Router location={url}>
					<App />
				</Router>
			</Suspense>
		</StrictMode>
	);
}
