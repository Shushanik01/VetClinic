let started = false;

const API_PATHS = [
  '/pets',
  '/appointments',
  '/auth',
  '/profile',
  '/feedback',
  '/clinics',
  '/clients',
  '/veterinarians',
];

const isApiRequest = (requestUrl: string): boolean => {
  try {
    const { pathname } = new URL(requestUrl);
    return API_PATHS.some((prefix) => pathname.startsWith(prefix));
  } catch {
    return false;
  }
};

export const startMockServer = async (): Promise<void> => {
  if (started) {
    return;
  }

  const { worker } = await import('~/mocks/browser');

  await worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
    onUnhandledRequest: (request, print) => {
      // Let navigation requests and non-API requests pass through silently.
      // Navigation requests (mode: 'navigate') are SPA routes handled by Vite;
      // MSW's passthrough can fail for them, so we skip error reporting entirely.
      if (request.mode === 'navigate' || !isApiRequest(request.url)) {
        return;
      }

      print.error();
    },
  });

  started = true;
};

export const shouldEnableMocking = (): boolean =>
  import.meta.env.VITE_ENABLE_MSW === 'true';
