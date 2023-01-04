import viteReact from '@vitejs/plugin-react';

import {
	dirname,
	join,
} from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [viteReact({ jsxRuntime: 'classic' })],
	root: join(
		dirname(new URL(import.meta.url).pathname),
		'src',
		'client',
	),
	build: {
		outDir: join(
			'..',
			'..',
			'dist',
		),
	},
});
