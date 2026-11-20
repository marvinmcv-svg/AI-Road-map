import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import StudentApp from './StudentApp';
import '@fontsource-variable/nunito';
import '../styles.css';

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <StudentApp />
    </HashRouter>
  </StrictMode>
);
