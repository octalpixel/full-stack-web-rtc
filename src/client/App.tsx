import {
	Route,
	Routes,
} from 'react-router-dom';

import './App.css';

import About from './screens/About';
import Conversation from './screens/Conversation';
import Navigation from './components/Navigation';
import Profile from './screens/Profile';

function App() {
	return (
		<>
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
		</>
	);
}

export default App;
