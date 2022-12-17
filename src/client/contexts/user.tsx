import {
	Dispatch,
	MutableRefObject,
	ReactElement,
	SetStateAction,
	createContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from 'react';

import io, { Socket } from 'socket.io-client';

import userReducer, {
	UserAction,
	UserState,
	unauthenticatedUserState,
} from '../reducers/user.js';
import AuthForm from '../components/AuthForm.jsx';

interface UserContextValue {
	dispatchUserAction: Dispatch<UserAction>;
	setAuthFormDisplayed: Dispatch<SetStateAction<boolean>>;
	socketRef: MutableRefObject<Socket | undefined>;
	userState: UserState;
}

export const UserContext = createContext<UserContextValue>({
	dispatchUserAction: () => { /* void */ },
	setAuthFormDisplayed: () => { /* void */ },
	socketRef: undefined as unknown as MutableRefObject<Socket | undefined>,
	userState: unauthenticatedUserState,
});

export const UserProvider = ({ children }: { children: ReactElement }): ReactElement => {
	const [userState, dispatchUserAction] = useReducer(
		userReducer,
		unauthenticatedUserState,
	);
	const socketRef = useRef<Socket>();
	const [authFormDisplayed, setAuthFormDisplayed] = useState(false);

	useEffect(
		() => {
			if (userState.authenticated) {
				socketRef.current = io({
					auth(cb){
						cb({ token: userState.accessToken }); 
					}, 
				});

				return () => {
					socketRef.current?.disconnect();
				};
			}
		},
		[userState.accessToken, userState.authenticated],
	);

	return (
		<UserContext.Provider
			value={{
				dispatchUserAction,
				setAuthFormDisplayed,
				socketRef,
				userState,
			}}
		>
			<AuthForm
				open={authFormDisplayed}
				toggleOpen={() => setAuthFormDisplayed((prevState) => !prevState)}
			/>
			{children}
		</UserContext.Provider>
	);
};
