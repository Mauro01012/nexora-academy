import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { applyBrandTheme } from '@/config/brand';
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/components.css';
import '@/styles/layout.css';
import '@/styles/home.css';
import '@/styles/catalog.css';
import '@/styles/account.css';

applyBrandTheme();
// Habilita as animações de entrada somente quando o JavaScript está ativo.
document.documentElement.classList.add('js');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
