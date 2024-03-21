import { defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');
    const config = {
      plugins: [react()],
      server: {
        open: true,
        port: parseInt(env.VITE_PORT, 10) || 3000,
      },
    //   preview: {
    //     headers:{
    //       'Content-Security-Policy': 'upgrade-insecure-requests',
    //       "X-Frame-Options": "DENY",
    //       "X-XSS-Protection": "1; mode=block"
    //     },
    //     port: parseInt(env.PORT, 10) || 3000,
    //   },
    };
  
    return config;
  });
