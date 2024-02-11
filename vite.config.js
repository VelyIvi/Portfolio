import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    base: "/Portfolio/"
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                poster: resolve(__dirname, 'poster/index.html'),
                bad: resolve(__dirname, 'jokeSite/index.html'),
            },
        },
    },
})