import {
	Dispatch,
	EventHandler,
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
} from '@mui/material/styles/index.js';
import useMediaQuery from '@mui/material/useMediaQuery/index.js';

import { Language } from '../types/language';
import { UserContext } from './user';

interface PreferencesContextValue {
	allowNotificationsState: boolean;
	darkModeState: boolean;
	languageState: Language;
	setAllowNotificationsState: Dispatch<SetStateAction<boolean>>;
	setDarkModeState: Dispatch<SetStateAction<boolean>>;
	setLanguageState: Dispatch<SetStateAction<Language>>;
}

export const PreferencesContext = createContext<PreferencesContextValue>({} as PreferencesContextValue);

export const PreferencesProvider = ({ children }: { children: ReactElement }): ReactElement => {
	const { userState: { authenticated } } = useContext(UserContext);
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [allowNotificationsState, setAllowNotificationsState] = useState<boolean>();
	const [darkModeState, setDarkModeState] = useState<boolean>();
	const [deferredAppInstallPrompt, setDeferredAppInstallPrompt] = useState<Event>();
	const [languageState, setLanguageState] = useState<Language>('English');

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

	useEffect(
		() => {
			const storePrompt: EventListenerOrEventListenerObject = (event) => {
				event.preventDefault();
				setDeferredAppInstallPrompt(event);
			};

			window.addEventListener(
				'beforeinstallprompt',
				storePrompt,
			);

			return () => {
				window.removeEventListener(
					'beforeinstallprompt',
					storePrompt,
				);
			};
		},
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
				languageState,
				setAllowNotificationsState: setAllowNotificationsState as Dispatch<SetStateAction<boolean>>,
				setDarkModeState: setDarkModeState as Dispatch<SetStateAction<boolean>>,
				setLanguageState,
			}}
		>
			<ThemeProvider theme={theme}>
				{children}
			</ThemeProvider>
		</PreferencesContext.Provider>
	);
};
