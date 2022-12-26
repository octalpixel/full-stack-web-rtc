import About from './screens/About.js';
import Conversation from './screens/Conversation.js';
import Profile from './screens/Profile.js';

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

export type Routes = typeof routes;

export default routes;
