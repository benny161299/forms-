import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { schemaApi } from "../../../api/schema.api";
import { instanceApi } from "../../../api/instance.api";
import { useDraftInstances } from "../../../hooks/useDraftInstances";
import { useDraftSchemas } from "../../../hooks/useDraftSchemas";
import { usePublishedSchemas } from "../../../hooks/usePublishedSchemas";
import { useSubmittedInstances } from "../../../hooks/useSubmittedInstances";

export function useHomeData() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const draftSchemas = useDraftSchemas();
  const publishedSchemas = usePublishedSchemas();
  const draftInstances = useDraftInstances();
  const submittedInstances = useSubmittedInstances();

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

  return {
    schemaDrafts: draftSchemas.schemas,
    publishedSchemas: publishedSchemas.schemas,
    instanceDrafts: draftInstances.instances,
    submittedInstances: submittedInstances.instances,

    isLoading:
      draftSchemas.loading ||
      publishedSchemas.loading ||
      draftInstances.loading ||
      submittedInstances.loading,

    errorMessage:
      draftSchemas.error ||
      publishedSchemas.error ||
      draftInstances.error ||
      submittedInstances.error,

    deleteSchema: deleteSchemaMutation.mutate,
    deleteInstance: deleteInstanceMutation.mutate,
    isDeleting:
      deleteSchemaMutation.isPending || deleteInstanceMutation.isPending,
  };
}
