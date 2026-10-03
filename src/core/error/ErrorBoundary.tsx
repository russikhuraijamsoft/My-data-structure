import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../logging/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught exception in React component tree', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-white text-[#800000] p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-[#ebd5da]">
            <h1 className="text-2xl font-bold text-[#800000] mb-4">Something went wrong</h1>
            <p className="text-[#800000]/80 mb-4">
              An unexpected error occurred in the application.
            </p>
            <div className="bg-[#fdf5f6] p-4 rounded text-sm font-mono overflow-auto mb-6 text-[#800000] border border-[#ebd5da]">
              {this.state.error?.message || 'Unknown error'}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-[#800000] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#680016] transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
