/*
 * This file is for configuring Vite to use the page entry in src/pages.
 */
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: resolve(__dirname, 'src/pages'),
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
  },
  test: {
    include: ['tests/**/*.test.ts'],
    root: resolve(__dirname),
  },
})
