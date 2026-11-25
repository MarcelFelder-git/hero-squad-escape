import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { route } from './route';
import './styles/global.css';
import './styles/v2.css';

const Presenter = lazy(() => import('./pages/Presenter'));
const Hall = lazy(() => import('./pages/Hall'));
const Worksheet = lazy(() => import('./pages/Worksheet'));

// prevent iOS double-tap zoom / pinch on the game surface
if (route !== 'worksheet') document.addEventListener('gesturestart', (e) => e.preventDefault());
document.body.classList.add(`route-${route}`);

const page =
  route === 'presenter' ? <Presenter /> : route === 'hall' ? <Hall /> : route === 'worksheet' ? <Worksheet /> : <App />;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="loading">Loading …</div>}>{page}</Suspense>
  </StrictMode>,
);
