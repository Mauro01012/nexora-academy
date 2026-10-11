import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // base relativa: o build funciona em qualquer hospedagem estática (a navegação usa hash).
  base: './',
  resolve: {
    // Caminho a partir da raiz do projeto: dispensa os tipos do Node (@types/node) neste arquivo.
    alias: { '@': '/src' },
  },
});
