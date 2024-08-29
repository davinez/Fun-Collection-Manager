import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: 'components', replacement: path.resolve(__dirname, 'src/components/') },
      { find: 'shared', replacement: path.resolve(__dirname, 'src/shared/') }
    ],
  },
  server: {
    host: true,
    strictPort: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
  },
  envDir: "./env"
});

