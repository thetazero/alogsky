import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "./",
    // @ts-ignore
    test: {
        globals: true, // Use global `describe`, `it`, etc.
        environment: 'jsdom', // Simulate a browser-like environment
        setupFiles: './src/setupTests.ts', // Optional setup file
    },
})
