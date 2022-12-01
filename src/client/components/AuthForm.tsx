import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';

import { trpc } from '../hooks/trpc';

interface AuthFormProps {
	open: boolean;
	toggleOpen(): void;
}

export default function AuthForm({
	open,
	toggleOpen,
}: AuthFormProps): JSX.Element {
	const login = trpc.account.login.useMutation();
	const register = trpc.account.register.useMutation();

	const [selectedTab, setSelectedTab] = useState(0);
	const [emailInput, setEmailInput] = useState('');
	const [nameInput, setNameInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [passwordVisible, setPasswordVisible] = useState(false);

	return (
		<Dialog
			onClose={toggleOpen}
			open={open}
		>
			{login.isLoading || register.isLoading
				? (
					<DialogContent className={classes.loadingSpinnerContainer}>
						<LoadingSpinner />
					</DialogContent>
				)
				: (
					<form onSubmit={submitForm}>
						<DialogTitle>
							<Tabs
								aria-label="authentication-options"
								onChange={(event, chosenTab) => setSelectedTab(chosenTab)}
								value={selectedTab}
								variant="fullWidth"
							>
								<Tab
									aria-controls="authentication-options-tabpanel-0"
									id="login-tab"
									label="Login"
								/>
								<Tab
									aria-controls="authentication-options-tabpanel-1"
									id="password-reset-tab"
									label="Password Reset"
								/>
								<Tab
									aria-controls="authentication-options-tabpanel-2"
									id="register-tab"
									label="Register"
								/>
							</Tabs>
						</DialogTitle>

						<DialogContent>
							<div
								aria-labelledby="login-tab"
								className={selectedTab === 0
									? classes.activeTab
									: undefined}
								hidden={selectedTab !== 0}
								id="authentication-options-tabpanel-0"
								role="tabpanel"
							>
								<TextField
									autoComplete="off"
									autoFocus={selectedTab === 0}
									fullWidth
									label="Email Address"
									margin="normal"
									onChange={(event) => setEmailInput(event.target.value)}
									required={selectedTab === 0}
									type="email"
									value={emailInput}
								/>

								<TextField
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													edge="end"
													onClick={() => setPasswordVisible((prevState) => !prevState)}
												>
													{passwordVisible
														? <VisibilityOffOutlinedIcon />
														: <VisibilityOutlinedIcon />}
												</IconButton>
											</InputAdornment>
										),
									}}
									autoComplete="off"
									fullWidth
									label="Password"
									margin="normal"
									onChange={(event) => setPasswordInput(event.target.value)}
									required={selectedTab === 0}
									type={passwordVisible
										? 'text'
										: 'password'}
									value={passwordInput}
								/>
							</div>

							<div
								aria-labelledby="password-reset-tab"
								className={selectedTab === 1
									? classes.activeTab
									: undefined}
								hidden={selectedTab !== 1}
								id="authentication-options-tabpanel-1"
								role="tabpanel"
							>
								<TextField
									autoComplete="off"
									autoFocus={selectedTab === 1}
									fullWidth
									label="Email Address"
									margin="normal"
									onChange={(event) => setEmailInput(event.target.value)}
									required={selectedTab === 1}
									type="email"
									value={emailInput}
								/>
							</div>

							<div
								aria-labelledby="register-tab"
								className={selectedTab === 2
									? classes.activeTab
									: undefined}
								hidden={selectedTab !== 2}
								id="authentication-options-tabpanel-2"
								role="tabpanel"
							>
								<TextField
									autoComplete="off"
									autoFocus={selectedTab === 2}
									fullWidth
									label="Email Address"
									margin="normal"
									onChange={(event) => setEmailInput(event.target.value)}
									required={selectedTab === 2}
									type="email"
									value={emailInput}
								/>

								<TextField
									autoComplete="off"
									fullWidth
									label="Account Name"
									margin="normal"
									onChange={(event) => setNameInput(event.target.value)}
									required={selectedTab === 2}
									type="text"
									value={nameInput}
								/>

								<TextField
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													edge="end"
													onClick={() => setPasswordVisible((prevState) => !prevState)}
												>
													{passwordVisible
														? <VisibilityOffOutlinedIcon />
														: <VisibilityOutlinedIcon />}
												</IconButton>
											</InputAdornment>
										),
									}}
									autoComplete="off"
									fullWidth
									label="Password"
									margin="normal"
									onChange={(event) => setPasswordInput(event.target.value)}
									required={selectedTab === 2}
									type={passwordVisible
										? 'text'
										: 'password'}
									value={passwordInput}
								/>
							</div>
						</DialogContent>
						<DialogActions>
							<Button type="submit">Submit</Button>
						</DialogActions>
					</form>
				)}
		</Dialog>
	);
}
