import {
	useContext,
	useState,
} from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import LightModeIcon from '@mui/icons-material/LightMode';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import { Link as RRDLink } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { AuthenticationContext } from '../contexts/authentication';
import { PreferencesContext } from '../contexts/preferences';

const Navigation = ({ children }: { children: JSX.Element }): JSX.Element => {
	const { userID } = useContext(AuthenticationContext);
	const {
		darkModeState,
		setDarkModeState,
	} = useContext(PreferencesContext);
	const [drawerOpen, setDrawerOpen] = useState(false);

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

			<IconButton
				color="inherit"
				component={RRDLink}
				to="/about"
			>
				<Tooltip title="About">
					<InfoIcon />
				</Tooltip>
			</IconButton>

			<IconButton
				color="inherit"
				component={RRDLink}
				to={`/profile/${userID}`}
			>
				<Tooltip title="My Profile">
					<FolderSharedIcon />
				</Tooltip>
			</IconButton>
		</>
	;
	
	return (
		<>
			<Box
				sx={{
					display: {
						md: 'flex',
						sm: 'none',
					},
				}}
			>
				<AppBar component="nav">
					<Toolbar>
						<IconButton
							aria-label="open drawer"
							color="inherit"
							edge="start"
							onClick={() => setDrawerOpen((prevState) => !prevState)}
							sx={{
								display: { sm: 'none' },
								mr: 2,
							}}
						>
							<MenuIcon />
						</IconButton>
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
						<Box
							sx={{
								display: {
									md: 'block',
									sm: 'none',
								},
							}}
						>
							<ButtonSet />
						</Box>
					</Toolbar>
				</AppBar>
				<Box component="nav">
					<Drawer
						ModalProps={{ keepMounted: true }}
						onClose={() => setDrawerOpen((prevState) => !prevState)}
						open={drawerOpen}
						sx={{
							'& .MuiDrawer-paper': {
								boxSizing: 'border-box',
								width: 240,
							},
							display: {
								sm: 'none',
								xs: 'block',
							},
						}}
						variant="temporary"
					>
						<Box
							onClick={() => setDrawerOpen((prevState) => !prevState)}
							sx={{ textAlign: 'center' }}
						>
							<Typography
								sx={{ my: 2 }}
								variant="h6"
							>
								Squad
							</Typography>
							<Divider />
							<List>
								{[].map((item) => 
									<ListItem
										disablePadding
										key={item}
									>
										<ListItemButton sx={{ textAlign: 'center' }}>
											<ListItemText primary={item} />
										</ListItemButton>
									</ListItem>)}
							</List>
						</Box>
					</Drawer>
				</Box>
			</Box>
			{children}
			<AppBar
				color="primary"
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
				<Toolbar>
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
