import { useTranslation } from "react-i18next";
import { draftSchema, schemaSchema, type Ischema } from "../../../types/schema.types";

export function useSchemaValidation(schema: Ischema) {
  const { t } = useTranslation();

  const validateDraft = (): string | null => {
    const result = draftSchema.safeParse(schema);

    if (!result.success) {
      const errorKey = result.error.issues[0]?.message;
      return errorKey ? t(errorKey) : t("schemaBuilder.saveError");
    }

    return null;
  };

  const validatePublish = (): string | null => {
    const result = schemaSchema.safeParse(schema);

    if (!result.success) {
      const errorKey = result.error.issues[0]?.message;
      return errorKey ? t(errorKey) : t("schemaBuilder.saveError");
    }

    return null;
  };

  return { validateDraft, validatePublish, validate: validatePublish };
}
