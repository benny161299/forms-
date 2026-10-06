import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { schemaApi } from "../api/schema.api";
export function useDraftSchemas() {
  const { t } = useTranslation();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["draftSchemas"],
    queryFn: schemaApi.getDraftSchemas,
  });

  const errorMessage = error ? t("errors.fetchDraftSchemas") : null;

  return {
    schemas: data ?? [],
    loading: isLoading,
    error: errorMessage,
    refetch,
  };
}