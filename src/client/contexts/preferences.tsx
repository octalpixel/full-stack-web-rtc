import {
	Dispatch, ReactElement, SetStateAction, createContext, useEffect,
	useMemo,
	useState,
} from 'react';

import {
	ThemeProvider, createTheme,
} from '@mui/material/styles';

import useMediaQuery from '@mui/material/useMediaQuery';

interface PreferencesContextValue {
	darkModeState: boolean;
	setDarkModeState: Dispatch<SetStateAction<boolean>>;
}

export const PreferencesContext = createContext<PreferencesContextValue>({} as PreferencesContextValue);

export const PreferencesProvider = ({ children }: { children: ReactElement }): ReactElement => {
	const [darkModeState, setDarkModeState] = useState<boolean>();
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	useEffect(
		() => setDarkModeState(prefersDarkMode),
		[prefersDarkMode],
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
			});
		},
		[darkModeState],
	);

	return (
		<PreferencesContext.Provider
			value={{
				darkModeState: darkModeState as boolean,
				setDarkModeState: setDarkModeState as Dispatch<SetStateAction<boolean>>,
			}}
		>
			<ThemeProvider theme={theme}>
				{children}
			</ThemeProvider>
		</PreferencesContext.Provider>
	);
};
