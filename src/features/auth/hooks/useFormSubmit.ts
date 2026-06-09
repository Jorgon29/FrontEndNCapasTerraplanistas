import { useState } from 'react';

const BASE_URL = process.env.BUN_PUBLIC_API_URL || 'http://localhost:8080';

export function useFormSubmit<TData, TResponse = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (endpoint: string, data: TData): Promise<TResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, error };
}