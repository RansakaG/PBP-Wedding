import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LoadingSpinner from './components/ui/LoadingSpinner';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Suspense fallback={
    <div className="h-screen w-screen flex items-center justify-center bg-brand-beige/20">
      <LoadingSpinner size="lg" />
    </div>
  }>
    <App />
  </Suspense>
);
