import {
	FastifyReply,
	FastifyRequest,
} from 'fastify';
import {
	StrictMode,
	Suspense,
} from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server.js';

import App from './App.jsx';
import { ClientModule } from './index.js';

const Router = (import.meta as any).env?.SSR
	? StaticRouter
	: BrowserRouter;

export interface CreateAppContext {
	reply: FastifyReply;
	req: FastifyRequest;
	server: ClientModule;
}

export function createApp(
	ctx: CreateAppContext,
	url: string,
) {
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

export type CreateApp = typeof createApp;
