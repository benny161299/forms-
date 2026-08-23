import { useDraftInstances } from "../../../hooks/useDraftInstances";
import { useDraftSchemas } from "../../../hooks/useDraftSchemas";
import { usePublishedSchemas } from "../../../hooks/usePublishedSchemas";
import { useSubmittedInstances } from "../../../hooks/useSubmittedInstances";

export function useHomeData() {
  const draftSchemas = useDraftSchemas();
  const publishedSchemas = usePublishedSchemas();
  const draftInstances = useDraftInstances();
  const submittedInstances = useSubmittedInstances();

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

    refetchDraftSchemas: draftSchemas.refetch,
    refetchDraftInstances: draftInstances.refetch,
  };
}
