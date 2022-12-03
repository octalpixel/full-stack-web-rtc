import React, { useState } from 'react';

import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import {
	Route,
	Routes,
} from 'react-router-dom';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './hooks/trpc';

import './App.css';

import About from './screens/About';
import Conversation from './screens/Conversation';
import Navigation from './components/Navigation';
import { PreferencesProvider } from './contexts/preferences';
import Profile from './screens/Profile';
import { UserProvider } from './contexts/user';

function App() {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					headers() {
						return {
							authorization: localStorage.getItem('accessToken')
								? `Bearer ${localStorage.getItem('accessToken')}`
								: undefined, 
						};
					},
					url: 'http://localhost:6969/trpc',
				}),
			],
		}));

	return (
		<trpc.Provider
			client={trpcClient}
			queryClient={queryClient}
		>
			<QueryClientProvider client={queryClient}>
				<PreferencesProvider>
					<UserProvider>
						<Navigation>
							<main>
								<Routes>
									<Route
										element={<About />}
										path="/"
									/>
									<Route
										element={<Conversation />}
										path="/conversation/:participantIDs"
									/>
									<Route
										element={<Profile />}
										path="/profile/:profileID"
									/>
								</Routes>
							</main>
						</Navigation>
					</UserProvider>
				</PreferencesProvider>
			</QueryClientProvider>
		</trpc.Provider>
	);
}

export default App;
