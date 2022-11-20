import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		error: { main: '#F41623' },
		info: { main: '#005778' },
		primary: { main: '#008E97' },
		secondary: { main: '#FC4C02' },
		success: { main: '#154734' },
		warning: { main: '#FFB81C' },
	},
});

export default theme;
