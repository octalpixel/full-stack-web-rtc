import React, {
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle.js';
import IconButton from '@mui/material/IconButton/index.js';
import InfoIcon from '@mui/icons-material/Info.js';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop.js';
import InstallMobileIcon from '@mui/icons-material/InstallMobile.js';
import LanguageIcon from '@mui/icons-material/Language.js';
import LightModeIcon from '@mui/icons-material/LightMode.js';
import LoginIcon from '@mui/icons-material/Login.js';
import LogoutIcon from '@mui/icons-material/Logout.js';
import Menu from '@mui/material/Menu/index.js';
import MenuItem from '@mui/material/MenuItem/index.js';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound.js';
import NotificationsIcon from '@mui/icons-material/Notifications.js';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff.js';
import { Link as RRDLink } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip/index.js';

import { PreferencesContext } from '../contexts/preferences.jsx';
import { UserContext } from '../contexts/user.jsx';
import { language } from '../../types/language.js';
import multilingualDictionary from '../constants/multilingual-dictionary.js';

interface NavigationButtonSetProps {
	setLogoutDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const NavigationButtonSet = ({ setLogoutDialogOpen }: NavigationButtonSetProps): JSX.Element => {
	const {
		allowNotificationsState,
		darkModeState,
		languageState,
		setAllowNotificationsState,
		setDarkModeState,
		setLanguageState,
	} = useContext(PreferencesContext);
	const {
		setAuthFormDisplayed,
		userState: {
			authenticated,
			userID,
		},
	} = useContext(UserContext);
	const [languageMenuAnchorElement, setLanguageMenuAnchorElement] = useState<HTMLButtonElement | null>(null);
	
	return (
		<>
			<IconButton
				color="inherit"
				onClick={() => setDarkModeState((prevState) => !prevState)}
			>
				{darkModeState
					? (
						<Tooltip title={multilingualDictionary.LightMode[languageState]}>
							<NightlightRoundIcon />
						</Tooltip>
					)
					: (
						<Tooltip title={multilingualDictionary.DarkMode[languageState]}>
							<LightModeIcon />
						</Tooltip>
					)}
			</IconButton>

			<IconButton
				color="inherit"
				onClick={({ currentTarget }) => setLanguageMenuAnchorElement(currentTarget)}
			>
				<Tooltip title={multilingualDictionary.Language[languageState]}>
					<LanguageIcon />
				</Tooltip>
			</IconButton>
			<Menu
				anchorEl={languageMenuAnchorElement}
				anchorOrigin={{
					horizontal: 'right',
					vertical: 'bottom', 
				}}
				id="language-menu"
				onClick={() => setLanguageMenuAnchorElement(null)}
				onClose={() => setLanguageMenuAnchorElement(null)}
				open={Boolean(languageMenuAnchorElement)}
				transformOrigin={{
					horizontal: 'right',
					vertical: 'top', 
				}}
			>
				{language.map((value) => (
					<MenuItem
						key={value}
						onClick={() => setLanguageState(value)}
					>
						{value}
					</MenuItem>
				))}
			</Menu>

			{authenticated
					&&
					<IconButton
						color="inherit"
						onClick={() => setAllowNotificationsState((prevState) => !prevState)}
					>
						{allowNotificationsState
							?
							<Tooltip title={multilingualDictionary.DisallowNotifications[languageState]}>
								<NotificationsIcon />
							</Tooltip>
							:
							<Tooltip title={multilingualDictionary.AllowNotifications[languageState]}>
								<NotificationsOffIcon />
							</Tooltip>
						}

					</IconButton>}

			<nav>
				<IconButton
					color="inherit"
					component={RRDLink}
					to="/about"
				>
					<Tooltip title={multilingualDictionary.About[languageState]}>
						<InfoIcon />
					</Tooltip>
				</IconButton>

				{authenticated && 
						<IconButton
							color="inherit"
							component={RRDLink}
							to={`/profile/${userID}`}
						>
							<Tooltip title={multilingualDictionary.MyProfile[languageState]}>
								<AccountCircleIcon />
							</Tooltip>
						</IconButton>}
			</nav>

			{authenticated
				?
				<IconButton
					color="inherit"
					onClick={() => setLogoutDialogOpen((prevState) => !prevState)}
				>
					<Tooltip title={multilingualDictionary.Logout[languageState]}>
						<LogoutIcon />
					</Tooltip>
				</IconButton>
				: 
				<IconButton
					color="inherit"
					onClick={() => setAuthFormDisplayed(true)}
				>
					<Tooltip title={multilingualDictionary.Login[languageState]}>
						<LoginIcon />
					</Tooltip>
				</IconButton>
			}
		</>
	);
};

export default NavigationButtonSet;
