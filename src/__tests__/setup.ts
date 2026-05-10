import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { mswServer } from '~/__tests__/msw-server';

if (!globalThis.__APP_CONFIG__) {
  globalThis.__APP_CONFIG__ = {
    API_URL: 'http://localhost:3000',
  };
}

Object.defineProperty(globalThis, 'AbortController', {
  configurable: true,
  writable: true,
  value: globalThis.AbortController,
});

Object.defineProperty(globalThis, 'AbortSignal', {
  configurable: true,
  writable: true,
  value: globalThis.AbortSignal,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

beforeAll(() => {
  mswServer.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  mswServer.resetHandlers();
  cleanup();
  vi.clearAllMocks();
});

afterAll(() => {
  mswServer.close();
});
