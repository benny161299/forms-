import { useTranslation } from "react-i18next";
import { instanceApi } from "../api/instance.api";
import { useSectionQuery } from "./useSectionQuery";

export function useSubmittedInstances() {
  const { t } = useTranslation();

  return useSectionQuery({
    queryKey: ["submittedInstances"],
    queryFn: instanceApi.getAllInstances,
    errorMessage: t("errors.fetchSubmittedInstances"),
  });
}
