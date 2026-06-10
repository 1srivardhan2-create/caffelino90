import { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;
  withLoading: <T>(promise: Promise<T>, message?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Brewing your experience...");

  const setLoading = (loading: boolean, message?: string) => {
    setIsLoading(loading);
    if (message) {
      setLoadingMessage(message);
    } else {
      setLoadingMessage("Brewing your experience...");
    }
  };

  const withLoading = async <T,>(promise: Promise<T>, message?: string): Promise<T> => {
    setLoading(true, message);
    try {
      const result = await promise;
      return result;
    } finally {
      // Add minimum loading time for smooth UX
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, loadingMessage, setLoading, withLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
