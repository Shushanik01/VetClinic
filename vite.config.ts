import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isMockMode = mode === 'mock' || env.VITE_ENABLE_MSW === 'true';

  return {
    plugins: [react(), svgr()],
    resolve: {
      alias: { '~': path.resolve(__dirname, './src') },
    },
    define: {
      __APP_MODE__: JSON.stringify(mode),
      __APP_MSW_MODE__: JSON.stringify(isMockMode),
    },
  };
});
