import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { schemaApi } from "../api/schema.api";

export function useDraftSchemas() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["draftSchemas"],
    queryFn: schemaApi.getDraftSchemas,
  });

  const deleteSchemaMutation = useMutation({
    mutationFn: (id: string) => schemaApi.deleteSchema(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draftSchemas"] });
      queryClient.invalidateQueries({ queryKey: ["schemas"] });
      toast.success(t("home.schemaDeleteSuccess"));
    },
    onError: () => {
      toast.error(t("home.schemaDeleteError"));
    },
  });

  const errorMessage = error ? t("errors.fetchDraftSchemas") : null;

  return {
    schemas: data ?? [],
    loading: isLoading,
    error: errorMessage,
    refetch,
    deleteSchema: deleteSchemaMutation.mutate,
    isDeleting: deleteSchemaMutation.isPending,
  };
}