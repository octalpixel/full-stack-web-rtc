import {
	Dispatch,
	ReactElement,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

import {
	ThemeProvider,
	createTheme,
} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { UserContext } from './user';

interface PreferencesContextValue {
	allowNotificationsState: boolean;
	darkModeState: boolean;
	setAllowNotificationsState: Dispatch<SetStateAction<boolean>>;
	setDarkModeState: Dispatch<SetStateAction<boolean>>;
}

export const PreferencesContext = createContext<PreferencesContextValue>({} as PreferencesContextValue);

export const PreferencesProvider = ({ children }: { children: ReactElement }): ReactElement => {
	const { userState: { authenticated } } = useContext(UserContext);
	const [allowNotificationsState, setAllowNotificationsState] = useState<boolean>();
	const [darkModeState, setDarkModeState] = useState<boolean>();
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	useEffect(
		() => setDarkModeState(prefersDarkMode),
		[prefersDarkMode],
	);

	useEffect(
		() => {
			if (!authenticated) setAllowNotificationsState(false);
		},
		[authenticated],
	);

	const theme = useMemo(
		() => {
			return createTheme({
				palette: {
					error: { main: '#F41623' },
					info: { main: '#005778' },
					mode: darkModeState
						? 'dark'
						: 'light',
					primary: { main: '#008E97' },
					secondary: { main: '#FC4C02' },
					success: { main: '#154734' },
					warning: { main: '#FFB81C' },
				},
				typography: { fontFamily: 'monospace' },
			});
		},
		[darkModeState],
	);

	return (
		<PreferencesContext.Provider
			value={{
				allowNotificationsState: allowNotificationsState as boolean,
				darkModeState: darkModeState as boolean,
				setAllowNotificationsState: setAllowNotificationsState as Dispatch<SetStateAction<boolean>>,
				setDarkModeState: setDarkModeState as Dispatch<SetStateAction<boolean>>,
			}}
		>
			<ThemeProvider theme={theme}>
				{children}
			</ThemeProvider>
		</PreferencesContext.Provider>
	);
};
