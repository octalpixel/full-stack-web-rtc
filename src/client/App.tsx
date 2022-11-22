import {
	Route,
	Routes,
} from 'react-router-dom';

import './App.css';

import About from './screens/About';
// import NavBar from './components/NavBar';
import Navigation from './components/Navigation';
import Profile from './screens/Profile';
import Squad from './screens/Squad';

function App() {
	return (
		<>
			<Navigation>
				{/* <NavBar /> */}
				<Routes>
					<Route
						element={<About />}
						path="/"
					/>
					<Route
						element={<Profile />}
						path="/profile/:id"
					/>
					<Route
						element={<Squad />}
						path="/squad/:id"
					/>
				</Routes>
			</Navigation>
		</>
	);
}

export default App;
