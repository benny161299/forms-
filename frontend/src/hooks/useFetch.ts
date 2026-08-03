import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiError } from "../api/axiosClient";

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  fallbackErrorKey: string
) {
  const { t } = useTranslation();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const execute = async () => {
      try {
        const result = await fetchFn();
        setData(result);
        setError(null);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError(t(fallbackErrorKey));
        }
      } finally {
        setLoading(false);
      }
    };

    execute();
  }, [fetchFn, fallbackErrorKey, t]);

  return { data, loading, error };
}