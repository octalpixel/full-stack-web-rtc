import { Language } from './language';

interface MultilingualDictionary {
	/** Tooltip text for the icon button navigation link to the page with information about the app */
	About: Record<Language, string>;
	/** Text displayed when user trys to join a conversation they are not invited to */
	AccessDenied: Record<Language, string>;
	/** Tooltip text for the icon button to turn on push notifications */
	AllowNotifications: Record<Language, string>;
	/** A general term for a group of loyal friends, possibly sharing a common goal */
	AppName: Record<Language, string>;
	/** Tooltip text for the icon button to switch the app into dark mode */
	DarkMode: Record<Language, string>;
	/** Tooltip text for the icon button to turn off push notifications */
	DisallowNotifications: Record<Language, string>;
	/** Tooltip text for the icon button to open a menu which can switch all the static text content on the site to a supported language */
	Language: Record<Language, string>;
	/** Tooltip text for the icon button to switch the app into light mode */
	LightMode: Record<Language, string>;
	/** Tooltip text for the icon button to display the login form */
	Login: Record<Language, string>;
	/** Tooltip text for the icon button which will log the user out of the application */
	Logout: Record<Language, string>;
	/** Tooltip text for the icon button navigation link to the page with information about the currently logged in user */
	MyProfile: Record<Language, string>;
}

export default MultilingualDictionary;
