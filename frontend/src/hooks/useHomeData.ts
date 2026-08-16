import { useDraftInstances } from "./useDraftInstances";
import { useDraftSchemas } from "./useDraftSchemas";
import { usePublishedSchemas } from "./usePublishedSchemas";
import { useSubmittedInstances } from "./useSubmittedInstances";

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