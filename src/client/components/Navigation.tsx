import {
	useContext,
	useState,
} from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import LightModeIcon from '@mui/icons-material/LightMode';
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

import {
	Language,
	PreferencesContext,
} from '../contexts/preferences';
import { UserContext } from '../contexts/user';

const Navigation = ({ children }: { children: JSX.Element }): JSX.Element => {
	const {
		dispatchUserAction,
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

	const ButtonSet = () => {
		const [languageMenuAnchorElement, setLanguageMenuAnchorElement] = useState<HTMLButtonElement | null>(null);
		return (
			<>
				<IconButton
					color="inherit"
					onClick={() => setDarkModeState((prevState) => !prevState)}
				>
					{darkModeState
						? 
						<Tooltip title="Light Mode">
							<LightModeIcon />
						</Tooltip>
						:
						<Tooltip title="Dark Mode">
							<NightlightRoundIcon />
						</Tooltip>
					}
				</IconButton>

				<IconButton
					color="inherit"
					onClick={({ currentTarget }) => setLanguageMenuAnchorElement(currentTarget)}
				>
					<Tooltip title="Language">
						<LanguageIcon />
					</Tooltip>
				</IconButton>
				<Menu
					// PaperProps={{
					// 	elevation: 0,
					// 	sx: {
					// 		overflow: 'visible',
					// 		filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
					// 		mt: 1.5,
					// 		'& .MuiAvatar-root': {
					// 			width: 32,
					// 			height: 32,
					// 			ml: -0.5,
					// 			mr: 1,
					// 		},
					// 		'&:before': {
					// 			content: '""',
					// 			display: 'block',
					// 			position: 'absolute',
					// 			top: 0,
					// 			right: 14,
					// 			width: 10,
					// 			height: 10,
					// 			bgcolor: 'background.paper',
					// 			transform: 'translateY(-50%) rotate(45deg)',
					// 			zIndex: 0,
					// 		},
					// 	},
					// }}
					anchorEl={languageMenuAnchorElement}
					anchorOrigin={{
						horizontal: 'right',
						vertical: 'bottom', 
					}}
					id="account-menu"
					onClick={() => setLanguageMenuAnchorElement(null)}
					onClose={() => setLanguageMenuAnchorElement(null)}
					open={Boolean(languageMenuAnchorElement)}
					transformOrigin={{
						horizontal: 'right',
						vertical: 'top', 
					}}
				>
					{Object.entries(Language).map(([key, value]) => (
						<MenuItem
							key={value}
							onClick={() => setLanguageState(key as Language)}
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
							<Tooltip title="Turn Off Notifications">
								<NotificationsIcon />
							</Tooltip>
							:
							<Tooltip title="Turn On Notifications">
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
						<Tooltip title="About">
							<InfoIcon />
						</Tooltip>
					</IconButton>

					{authenticated && 
						<IconButton
							color="inherit"
							component={RRDLink}
							to={`/profile/${userID}`}
						>
							<Tooltip title="My Profile">
								<AccountCircleIcon />
							</Tooltip>
						</IconButton>}
				</nav>

				{authenticated
					?
					<IconButton
						color="inherit"
						onClick={() => dispatchUserAction({ type: 'Logout' }) }
					>
						<Tooltip title="Logout">
							<LogoutIcon />
						</Tooltip>
					</IconButton>
					: 
					<IconButton
						color="inherit"
						// onClick={() => }
					>
						<Tooltip title="Login">
							<LoginIcon />
						</Tooltip>
					</IconButton>
				}
			</>
		);
	};
	
	return (
		<>
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
						Squad
						<ShieldOutlinedIcon />
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
