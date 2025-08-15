import React, { Suspense, ComponentType } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface LazyRouteProps {
  component: ComponentType<any>;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  [key: string]: any;
}

const DefaultLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const DefaultErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center p-8 max-w-md">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6">
        We encountered an error while loading this page. Please try again.
      </p>
      <div className="space-y-2">
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go Home
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  </div>
);

export const LazyRoute = ({ 
  component: Component, 
  fallback: Fallback = DefaultLoadingSpinner,
  errorFallback: ErrorFallback = DefaultErrorFallback,
  ...props 
}: LazyRouteProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={<Fallback />}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Higher-order component for creating lazy routes with error boundaries
export const withLazyLoading = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ComponentType,
  errorFallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>
) => {
  const LazyComponent = React.lazy(importFn);
  
  return (props: P) => (
    <LazyRoute
      component={LazyComponent}
      fallback={fallback}
      errorFallback={errorFallback}
      {...props}
    />
  );
};

// Utility for preloading components
export const preloadComponent = (importFn: () => Promise<any>) => {
  return importFn();
};

// Hook for progressive loading with priority
export const useProgressiveLoad = (importFn: () => Promise<any>, priority: 'high' | 'medium' | 'low' = 'medium') => {
  React.useEffect(() => {
    const timeouts = {
      high: 0,
      medium: 100,
      low: 1000,
    };
    
    const timeout = setTimeout(() => {
      importFn();
    }, timeouts[priority]);
    
    return () => clearTimeout(timeout);
  }, [importFn, priority]);
};
