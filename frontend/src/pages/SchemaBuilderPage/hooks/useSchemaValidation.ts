import { useTranslation } from "react-i18next";
import { schemaSchema, type Ischema } from "../../../types/schema.types";

export function useSchemaValidation(schema: Ischema) {
  const { t } = useTranslation();

  const validate = (): string | null => {
    const result = schemaSchema.safeParse(schema);

    if (!result.success) {
      const errorKey = result.error.issues[0]?.message;
      return errorKey ? t(errorKey) : t("schemaBuilder.saveError");
    }

    return null;
  };

  return { validate };
}