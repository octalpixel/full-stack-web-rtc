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
	setUserID: Dispatch<SetStateAction<string>>;
	setUserName: Dispatch<SetStateAction<string>>;
	userID: string;
	userName: string;
}

export const AuthenticationContext = createContext<AuthenticationContextValue>({
	accessToken: '',
	refreshToken: '',
	setAccessToken: undefined as unknown as Dispatch<SetStateAction<string>>,
	setRefreshToken: undefined as unknown as Dispatch<SetStateAction<string>>,
	setUserID: undefined as unknown as Dispatch<SetStateAction<string>>,
	setUserName: undefined as unknown as Dispatch<SetStateAction<string>>,
	userID: '',
	userName: '',
});

export const AuthenticationProvider = ({ children }: { children: ReactElement }): ReactElement => {
	const [accessToken, setAccessToken] = useState<string>('');
	const [refreshToken, setRefreshToken] = useState<string>('');
	const [userID, setUserID] = useState<string>('123');
	const [userName, setUserName] = useState<string>('');

	return (
		<AuthenticationContext.Provider
			value={{
				accessToken,
				refreshToken,
				setAccessToken,
				setRefreshToken,
				setUserID,
				setUserName,
				userID,
				userName,
			}}
		>
			{children}
		</AuthenticationContext.Provider>
	);
};
