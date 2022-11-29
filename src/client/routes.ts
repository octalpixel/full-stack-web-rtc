import About from './screens/About';
import Profile from './screens/Profile';
import Squad from './screens/Conversation';

const routes = [
	{
		component: About,
		path: '/',
	},
	{
		component: Profile,
		path: '/profile/:profileID',
	},
	{
		component: Squad,
		path: '/squad/:squadID',
	},
];

export default routes;
