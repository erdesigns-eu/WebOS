/// <reference types="vitest" />

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  test: {
    name: 'WebOS',
    globals: true,
    environment: 'edge-runtime',
    threads: true,
    maxThreads: 10,
    maxConcurrency: 10,
    silent: false,
    ui: true,
    browser: {
      name: 'edge',
      enabled: true,
      headless: true,
    },
    open: true,
    logHeapUsage: true,
    retry: 0,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    manifest: false,
  },
});