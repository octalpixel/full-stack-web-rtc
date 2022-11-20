import { useContext } from 'react';

import { AuthenticationContext } from './contexts/authentication';

import './App.css';

function App() {
	const {
		setUserName,
		userName,
	} = useContext(AuthenticationContext);
	return (
		<>
			<h1>
				Sup?
			</h1>
			<input
				onChange={({ target: { value } }) => setUserName(value)}
				value={userName}
			/>
		</>
	);
}

export default App;
