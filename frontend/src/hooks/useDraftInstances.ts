import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { instanceApi } from "../api/instance.api";

export function useDraftInstances() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["draftInstances"],
    queryFn: instanceApi.getDraftInstances,
  });

  const deleteInstanceMutation = useMutation({
    mutationFn: (id: string) => instanceApi.deleteInstance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draftInstances"] });
      queryClient.invalidateQueries({ queryKey: ["instances"] });
      toast.success(t("home.instanceDeleteSuccess"));
    },
    onError: () => {
      toast.error(t("home.instanceDeleteError"));
    },
  });

  const errorMessage = error ? t("errors.fetchDraftInstances") : null;

  return {
    instances: data ?? [],
    loading: isLoading,
    error: errorMessage,
    refetch,
    deleteInstance: deleteInstanceMutation.mutate,
    isDeleting: deleteInstanceMutation.isPending,
  };
}
