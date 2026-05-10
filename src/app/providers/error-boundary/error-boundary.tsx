import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    globalThis.location.reload();
  };

  handleGoHome = () => {
    globalThis.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
          <div className="p-8 bg-white text-center rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] max-w-md w-full">
            <h2 className="text-3xl font-bold text-red-600 mb-3">
              Something went wrong
            </h2>
            <p className="text-black-600 mb-6">
              Oops! An unexpected error occurred.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="btn-regular-l bg-green-600 text-white hover:bg-green-700"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="btn-regular-l bg-gray-200 text-black hover:bg-gray-300"
              >
                Back to Main Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
