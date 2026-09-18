import { useState, useEffect } from 'react';

export function useFetchData(fetchFunction, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    fetchFunction({ signal: controller.signal })
      .then((res) => {
        if (isMounted) {
          setData(res);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message || 'Error al cargar datos');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}