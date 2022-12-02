import editAccount from './edit-account.js';
import login from './login.js';
import logout from './logout.js';
import logoutAll from './logout-all.js';
import refresh from './refresh.js';
import register from './register.js';
import requestPasswordReset from './request-password-reset.js';
import { router } from '../../trpc.js';
import submitPasswordReset from './submit-password-reset.js';
import subscribeToPushNotifications from './subscribe-to-push-notifications.js';
import unsubscribeFromPushNotifications from './unsubscribe-from-push-notifications.js';

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
