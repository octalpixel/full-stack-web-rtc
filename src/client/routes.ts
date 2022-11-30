import About from './screens/About';
import Conversation from './screens/Conversation';
import Profile from './screens/Profile';

const routes = [
	{
		component: About,
		path: '/',
	},
	{
		component: Conversation,
		path: '/conversation/:participantIDs',
	},
	{
		component: Profile,
		path: '/profile/:profileID',
	},
];

export default routes;
