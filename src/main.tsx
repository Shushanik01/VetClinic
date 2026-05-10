import { createRoot } from 'react-dom/client';
import { App } from '~/app';
import { shouldEnableMocking, startMockServer } from '~/mocks';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const bootstrap = async (): Promise<void> => {
  if (shouldEnableMocking()) {
    await startMockServer();
  }

  createRoot(rootElement).render(<App />);
};

void bootstrap();
