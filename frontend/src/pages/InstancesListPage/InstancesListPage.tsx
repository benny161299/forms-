import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useSubmittedInstances } from "../../hooks/useSubmittedInstances";
import { InstanceCard } from "../HomePage/components/InstanceCard";
import { InstanceViewModal } from "./InstanceViewModal";
import { ListPage } from "../../components/common/ListPage";

import type { IInstance } from "../../types/instance.types";

export const InstancesListPage = () => {
  const { t } = useTranslation();

  const { instances, loading, error, isError, hasData, refetch } =
    useSubmittedInstances();

  const [selectedInstance, setSelectedInstance] = useState<IInstance | null>(
    null
  );

  return (
    <ListPage
      title={t("listPages.instancesTitle")}
      items={instances}
      loading={loading}
      isError={isError}
      hasData={hasData}
      error={error}
      emptyMessage={t("listPages.instancesEmpty")}
      onRetry={refetch}
      renderItem={(instance, index) => (
        <InstanceCard
          key={instance._id}
          instance={instance}
          index={index}
          onView={() => setSelectedInstance(instance)}
        />
      )}
      modal={
        <InstanceViewModal
          instance={selectedInstance}
          onClose={() => setSelectedInstance(null)}
        />
      }
    />
  );
};

export default InstancesListPage;
