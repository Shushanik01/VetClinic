import { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import {
  createTestStore,
  type TestRootState,
  type TestStore,
} from '~/__tests__/test-store';

type ExtendedRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  route?: string;
  preloadedState?: Partial<TestRootState>;
  store?: TestStore;
};

export const renderWithProviders = (
  ui: ReactElement,
  {
    route = '/',
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

export * from '@testing-library/react';
