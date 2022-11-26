import {
	Dispatch,
	MutableRefObject,
	ReactElement,
	createContext,
	useEffect,
	useReducer,
	useRef,
} from 'react';

import io, { Socket } from 'socket.io-client';

import userReducer, {
	UserAction,
	UserState,
	unauthenticatedUserState,
} from '../reducers/user';

interface UserContextValue {
	dispatchUserAction: Dispatch<UserAction>;
	socketRef: MutableRefObject<Socket | undefined>;
	userState: UserState;
}

export const UserContext = createContext<UserContextValue>({
	dispatchUserAction: (() => { /* void */ }) as Dispatch<UserAction>,
	socketRef: undefined as unknown as MutableRefObject<Socket | undefined>,
	userState: unauthenticatedUserState,
});

export const UserProvider = ({ children }: { children: ReactElement }): ReactElement => {
	const [userState, dispatchUserAction] = useReducer(
		userReducer,
		unauthenticatedUserState,
	);
	const socketRef = useRef<Socket>();

	useEffect(
		() => {
			if (userState.authenticated) {
				socketRef.current = io();

				socketRef.current.on(
					'',
					() => {

					},
				);

				return () => {
					
				};
			}
		},
		[userState.authenticated],
	);

	return (
		<UserContext.Provider
			value={{
				dispatchUserAction,
				socketRef,
				userState,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
