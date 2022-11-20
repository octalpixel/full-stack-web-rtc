// import react from '@vitejs/plugin-react';

import viteReact from '@vitejs/plugin-react';

import {
	dirname,
	join,
} from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	// plugins: [react()],
	plugins: [viteReact({ jsxRuntime: 'classic' })],
	root: join(
		dirname(new URL(import.meta.url).pathname),
		'src',
		'client',
	),
});
