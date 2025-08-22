import { ErrorBoundary } from './lib/providers/ErrorBoundary';
import { TunesPage } from './features/tunes/TunesPage';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <TunesPage />
    </ErrorBoundary>
  );
}

export default App;
