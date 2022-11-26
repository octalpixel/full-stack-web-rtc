import {
	Route,
	Routes,
} from 'react-router-dom';

import './App.css';

import About from './screens/About';
import Navigation from './components/Navigation';
import Profile from './screens/Profile';
import Squad from './screens/Squad';

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
							element={<Profile />}
							path="/profile/:profileID"
						/>
						<Route
							element={<Squad />}
							path="/squad/:squadID"
						/>
					</Routes>
				</main>
			</Navigation>
		</>
	);
}

export default App;
