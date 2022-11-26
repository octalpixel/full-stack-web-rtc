import { useContext } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import LightModeIcon from '@mui/icons-material/LightMode';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { Link as RRDLink } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { PreferencesContext } from '../contexts/preferences';
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
		setAllowNotificationsState,
		setDarkModeState,
	} = useContext(PreferencesContext);

	const ButtonSet = () => 
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
	;
	
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
