import React, {
	useContext,
	useEffect,
	useState,
} from 'react';

import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import NavigationButtonSet from './NavigationButtonSet';
import { PreferencesContext } from '../contexts/preferences';
import { UserContext } from '../contexts/user';
import multilingualDictionary from '../constants/multilingual-dictionary';
import { trpc } from '../hooks/trpc';

const Navigation = ({ children }: { children: JSX.Element }): JSX.Element => {
	const {
		dispatchUserAction,
		userState: { authenticated },
	} = useContext(UserContext);
	const { languageState } = useContext(PreferencesContext);
	const logout = trpc.account.logout.useMutation();
	const logoutAll = trpc.account.logoutAll.useMutation();
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

	useEffect(
		() => {
			if (logout.isSuccess) dispatchUserAction({ type: 'Logout' });
		},
		[dispatchUserAction, logout.isSuccess],
	);

	useEffect(
		() => {
			if (logoutAll.isSuccess) dispatchUserAction({ type: 'Logout' });
		},
		[dispatchUserAction, logoutAll.isSuccess],
	);
	
	return (
		<>
			<Dialog
				onClose={() => setLogoutDialogOpen((prevState) => !prevState)}
				open={authenticated && logoutDialogOpen}
			>
				<DialogTitle>
					{multilingualDictionary.LogoutConfirmationDialogTitle[languageState]}
				</DialogTitle>
				<List>
					<ListItem
						button
						onClick={() => {
							logout.mutate();
							setLogoutDialogOpen((prevState) => !prevState);
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
							setLogoutDialogOpen((prevState) => !prevState);
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
					<NavigationButtonSet setLogoutDialogOpen={setLogoutDialogOpen} />
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
					<NavigationButtonSet setLogoutDialogOpen={setLogoutDialogOpen} />
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
