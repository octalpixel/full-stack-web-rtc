import {
	useContext,
	useState,
} from 'react';

import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { PreferencesContext } from '../contexts/preferences';

const NavBar = (): JSX.Element => {
	const {
		darkModeState,
		setDarkModeState,
	} = useContext(PreferencesContext);
	const [drawerOpen, setDrawerOpen] = useState(false);
	
	return (
		<Box sx={{ display: 'flex' }}>
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
								sm: 'block',
								xs: 'none',
							},
						}}
					>
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
							MUI
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
			<Box
				component="main"
				sx={{ p: 3 }}
			>
				<Toolbar />
			</Box>
		</Box>
	);
};

export default NavBar;
