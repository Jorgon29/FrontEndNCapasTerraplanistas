import { useState } from 'react';
import apiClient from '@/lib/apiClient';

export function useFormSubmit<TData, TResponse = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (endpoint: string, data: TData): Promise<TResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<TResponse>(endpoint, data);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, error };
}