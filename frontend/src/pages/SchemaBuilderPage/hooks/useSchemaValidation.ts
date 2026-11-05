import { useTranslation } from "react-i18next";
import type { ZodError } from "zod";
import { draftSchema, schemaSchema, type Ischema } from "../../../types/schema.types";

export function useSchemaValidation(schema: Ischema) {
  const { t, i18n } = useTranslation();

  const getErrorMessage = (error: ZodError): string => {
    const firstIssue = error.issues[0];
    if (!firstIssue) return t("schemaBuilder.saveError");
    const errorKey = firstIssue.message;
    if (errorKey && i18n.exists(errorKey)) {
      return t(errorKey);
    }
    return errorKey || t("schemaBuilder.saveError");
  };

  const validateDraft = (): string | null => {
    const result = draftSchema.safeParse(schema);

    if (!result.success) {
      return getErrorMessage(result.error);
    }

    return null;
  };

  const validatePublish = (): string | null => {
    const result = schemaSchema.safeParse(schema);

    if (!result.success) {
      return getErrorMessage(result.error);
    }

    return null;
  };

  return { validateDraft, validatePublish, validate: validatePublish };
}
