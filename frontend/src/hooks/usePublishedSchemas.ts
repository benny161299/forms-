import { schemaApi } from "../api/schema.api";
import { useSectionQuery } from "./useSectionQuery";

export function usePublishedSchemas() {
  const query = useSectionQuery({
    queryKey: ["publishedSchemas"],
    queryFn: schemaApi.getAllSchemas,
    errorKey: "errors.fetchPublishedSchemas",
  });

  return {
    ...query,
    schemas: query.items,
  };
}
