import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { instanceApi } from "../../../api/instance.api";
import { InstanceCard } from "./InstanceCard";
import { DraftsSectionBase } from "./DraftsSectionBase";
import type { IInstance } from "../../../types/instance.types";

export const InstanceDraftsSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <DraftsSectionBase<IInstance>
      title={t("home.instanceDrafts")}
      queryKey={["draftInstances"]}
      queryFn={instanceApi.getDraftInstances}
      deleteFn={instanceApi.deleteInstance}
      errorMessage={t("errors.fetchDraftInstances")}
      emptyMessage={t("home.emptyInstanceDrafts")}
      deleteSuccessMessage={t("home.instanceDeleteSuccess")}
      deleteErrorMessage={t("home.instanceDeleteError")}
      confirmDeleteTitle={t("home.confirmDeleteTitle")}
      confirmDeleteDescription={t("home.confirmDeleteInstance")}
      renderItem={(instance, index, requestDelete) => (
        <InstanceCard
          key={instance._id}
          instance={instance}
          index={index}
          onContinueFill={(instanceId) =>
            navigate(`/instances/edit/${instanceId}`)
          }
          onDelete={requestDelete}
        />
      )}
    />
  );
};
