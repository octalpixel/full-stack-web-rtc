import { createApp } from './base.jsx';
import routes from './routes.js';

const clientModule = {
	createApp,
	routes,
};

export type ClientModule = typeof clientModule;

export default clientModule;
