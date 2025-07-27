import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 8000,
		host: true,
		open: true,
	},
	base: '/',
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
	},
	optimizeDeps: {
		include: ['@emotion/styled'],
	},
	define: {
		'process.env.VITE_URL': JSON.stringify(process.env.VITE_URL),
	},
});
