export const language = [
	'English',
	'Español',
	'中文',
] as const;

export type Language = typeof language[number];
