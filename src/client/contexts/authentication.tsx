import {
	Dispatch, ReactElement,
	SetStateAction,
	createContext, useState,
} from 'react';

interface AuthenticationContextValue {
	accessToken: string;
	refreshToken: string;
	setAccessToken: Dispatch<SetStateAction<string>>;
	setRefreshToken: Dispatch<SetStateAction<string>>;
	setUserName: Dispatch<SetStateAction<string>>;
	userName: string;
}

export const AuthenticationContext = createContext<AuthenticationContextValue>({
	accessToken: '',
	refreshToken: '',
	setAccessToken: () => { /* */ },
	setRefreshToken: () => { /* */ },
	setUserName: () => { /* */ },
	userName: '',
});

export const AuthenticationProvider = ({ children }: { children: ReactElement }): ReactElement => {
	const [accessToken, setAccessToken] = useState<string>('');
	const [refreshToken, setRefreshToken] = useState<string>('');
	const [userName, setUserName] = useState<string>('');

	return (
		<AuthenticationContext.Provider
			value={{
				accessToken,
				refreshToken,
				setAccessToken,
				setRefreshToken,
				setUserName,
				userName,
			}}
		>
			{children}
		</AuthenticationContext.Provider>
	);
};
