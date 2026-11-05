import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { usePublishedSchemas } from "../../hooks/usePublishedSchemas";
import { SchemaCard } from "../HomePage/components/SchemaCard";
import { SchemaViewModal } from "./SchemaViewModal";
import { ListPage } from "../../components/common/ListPage";

import type { Ischema } from "../../types/schema.types";

export const SchemasListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { schemas, loading, error, isError, hasData, refetch } =
    usePublishedSchemas();

  const [selectedSchema, setSelectedSchema] = useState<Ischema | null>(null);

  return (
    <ListPage
      title={t("listPages.schemasTitle")}
      items={schemas}
      loading={loading}
      isError={isError}
      hasData={hasData}
      error={error}
      emptyMessage={t("listPages.schemasEmpty")}
      onRetry={refetch}
      renderItem={(schema, index) => (
        <SchemaCard
          key={schema._id}
          schema={schema}
          index={index}
          onFill={(id) => navigate(`/instances/fill/${id}`)}
          onView={() => setSelectedSchema(schema)}
        />
      )}
      modal={
        <SchemaViewModal
          schema={selectedSchema}
          onClose={() => setSelectedSchema(null)}
        />
      }
    />
  );
};

export default SchemasListPage;
