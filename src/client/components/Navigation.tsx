import React, {
	useContext,
	useState,
} from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import LightModeIcon from '@mui/icons-material/LightMode';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { Link as RRDLink } from 'react-router-dom';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { PreferencesContext } from '../contexts/preferences';
import { UserContext } from '../contexts/user';
import { language } from '../types/language';
import multilingualDictionary from '../constants/multilingual-dictionary';
import { trpc } from '../hooks/trpc';

const Navigation = ({ children }: { children: JSX.Element }): JSX.Element => {
	const {
		dispatchUserAction,
		setAuthFormDisplayed,
		userState: {
			authenticated,
			userID,
		},
	} = useContext(UserContext);
	const {
		allowNotificationsState,
		darkModeState,
		languageState,
		setAllowNotificationsState,
		setDarkModeState,
		setLanguageState,
	} = useContext(PreferencesContext);
	const logout = trpc.account.logout.useMutation();
	const logoutAll = trpc.account.logoutAll.useMutation();
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

	const ButtonSet = () => {
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
	
	return (
		<>
			<Dialog
				onClose={() => setLogoutDialogOpen((prevState) => !prevState)}
				open={authenticated && logoutDialogOpen}
			>
				<DialogTitle>
					Choose Logout Method
				</DialogTitle>
				<List>
					<ListItem
						button
						onClick={() => {
							logout.mutate();
							setTimeout(
								() => dispatchUserAction({ type: 'Logout' }),
								0,
							);
						}}
					>
						<Typography variant="button">
							{multilingualDictionary.LogoutThisDevice[languageState]}
						</Typography>
					</ListItem>

					<ListItem
						button
						onClick={() => {
							logoutAll.mutate();
							setTimeout(
								() => dispatchUserAction({ type: 'Logout' }),
								0,
							);
						}}
					>
						<Typography variant="button">
							{multilingualDictionary.LogoutAllDevices[languageState]}
						</Typography>
					</ListItem>

					<ListItem
						button
						onClick={() => setLogoutDialogOpen((prevState) => !prevState)}
					>
						<Typography variant="button">
							{multilingualDictionary.CancelLogout[languageState]}
						</Typography>
					</ListItem>
				</List>
			</Dialog>

			<AppBar
				position="sticky"
				sx={{
					display: {
						lg: 'flex',
						md: 'flex',
						sm: 'none',
						xl: 'flex',
						xs: 'none',
					},
				}}
			>
				<Toolbar>
					<Typography
						component="div"
						sx={{
							display: {
								sm: 'block',
								xs: 'none',
							},
							flexGrow: 1,
						}}
						variant="h6"
					>
						<ShieldOutlinedIcon />
						{multilingualDictionary.AppName[languageState]}
					</Typography>
					<ButtonSet />
				</Toolbar>
			</AppBar>
			{children}
			<AppBar
				position="fixed"
				sx={{
					bottom: 0,
					display: {
						md: 'none',
						sm: 'inherit',
					},
					top: 'auto',
				}}
			>
				<Toolbar component="nav">
					<ButtonSet />
					{/* <StyledFab
						aria-label="add"
						color="secondary"
					>
						<AddIcon />
					</StyledFab> */}
					{/* <Box sx={{ flexGrow: 1 }} /> */}
				</Toolbar>
			</AppBar>
		</>
	);
};

export default Navigation;
