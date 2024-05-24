import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({

  //as frontend is 5173 and backend is 3000 so to convert we use proxy
  server:{
    proxy:{
      '/api': {
        target: 'http://localhost:3000',
        secure: 'false', //because this is http not https
      },
    },
  },
  plugins: [react()],
})
