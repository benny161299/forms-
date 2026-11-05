import { useTranslation } from "react-i18next";
import { schemaApi } from "../api/schema.api";
import { useSectionQuery } from "./useSectionQuery";

export function usePublishedSchemas() {
  const { t } = useTranslation();

  return useSectionQuery({
    queryKey: ["publishedSchemas"],
    queryFn: schemaApi.getAllSchemas,
    errorMessage: t("errors.fetchPublishedSchemas"),
  });
}
