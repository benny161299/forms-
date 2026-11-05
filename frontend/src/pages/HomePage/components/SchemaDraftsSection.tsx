import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { schemaApi } from "../../../api/schema.api";
import { SchemaCard } from "./SchemaCard";
import { DraftsSectionBase } from "./DraftsSectionBase";
import type { Ischema } from "../../../types/schema.types";

export const SchemaDraftsSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <DraftsSectionBase<Ischema>
      title={t("home.schemaDrafts")}
      queryKey={["draftSchemas"]}
      queryFn={schemaApi.getDraftSchemas}
      deleteFn={schemaApi.deleteSchema}
      errorMessage={t("errors.fetchDraftSchemas")}
      emptyMessage={t("home.emptySchemaDrafts")}
      deleteSuccessMessage={t("home.schemaDeleteSuccess")}
      deleteErrorMessage={t("home.schemaDeleteError")}
      confirmDeleteTitle={t("home.confirmDeleteTitle")}
      confirmDeleteDescription={t("home.confirmDeleteSchema")}
      renderItem={(schema, index, requestDelete) => (
        <SchemaCard
          key={schema._id}
          schema={schema}
          index={index}
          onEdit={(id) => navigate(`/schemas/edit/${id}`)}
          onDelete={requestDelete}
        />
      )}
    />
  );
};
