import { instanceApi } from "../api/instance.api";
import { useSectionQuery } from "./useSectionQuery";

export function useSubmittedInstances() {
  const query = useSectionQuery({
    queryKey: ["submittedInstances"],
    queryFn: instanceApi.getAllInstances,
    errorKey: "errors.fetchSubmittedInstances",
  });

  return {
    ...query,
    instances: query.items,
  };
}
