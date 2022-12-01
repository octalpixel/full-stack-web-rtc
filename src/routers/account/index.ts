import { router } from '../../trpc';

import editAccount from './edit-account';
import login from './login';
import logout from './logout';
import logoutAll from './logout-all';
import refresh from './refresh';
import register from './register';
import requestPasswordReset from './request-password-reset';
import submitPasswordReset from './submit-password-reset';
import subscribeToPushNotifications from './subscribe-to-push-notifications';
import unsubscribeFromPushNotifications from './unsubscribe-from-push-notifications';

export const accountRouter = router({
	editAccount,
	login,
	logout,
	logoutAll,
	refresh,
	register,
	requestPasswordReset,
	submitPasswordReset,
	subscribeToPushNotifications,
	unsubscribeFromPushNotifications,
});

export default accountRouter;
