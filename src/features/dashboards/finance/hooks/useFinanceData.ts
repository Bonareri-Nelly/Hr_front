import { useState, useEffect } from 'react';

export const useFinanceData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<Error | null>(null);
  const [data, setData] = useState<Record<string, never> | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
      setData({});
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const refetch = () => {
    console.log('Refetching finance data...');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return {
    data,
    isLoading,
    error,
    refetch
  };
};
