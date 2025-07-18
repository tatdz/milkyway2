import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildServer() {
  try {
    await build({
      entryPoints: [resolve(__dirname, 'server/index.ts')],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outdir: resolve(__dirname, 'dist'),
      external: [
        // External packages that should not be bundled
        'express',
        'express-session',
        'passport',
        'passport-local',
        'connect-pg-simple',
        'memorystore',
        'ws',
        'nanoid',
        // Vite and related packages should be external in production
        'vite',
        '@vitejs/plugin-react',
        '@replit/vite-plugin-cartographer',
        '@replit/vite-plugin-runtime-error-modal',
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        // Define vite as undefined to prevent imports
        'vite': 'undefined',
        'createViteServer': 'undefined',
        'createLogger': 'undefined',
        'viteConfig': 'undefined',
      },
      sourcemap: false,
      minify: true,
      treeShaking: true,
      // Add conditions to handle dynamic imports
      conditions: ['production'],
    });
    
    console.log('Server build completed successfully');
  } catch (error) {
    console.error('Server build failed:', error);
    process.exit(1);
  }
}

buildServer(); 