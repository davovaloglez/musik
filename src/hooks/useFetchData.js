import { useState, useEffect } from 'react';

export function useFetchData(fetchFunction, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetchFunction({ signal: controller.signal })
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error al cargar datos');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, deps);

  return { data, loading, error };
}