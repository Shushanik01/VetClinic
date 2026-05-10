export {};

declare global {
  const __APP_MSW_MODE__: boolean;

  interface Window {
    __APP_CONFIG__: {
      API_URL: string;
    };
  }
  var __APP_CONFIG__: {
    API_URL: string;
  };
}
