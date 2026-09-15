import { useTranslation } from "react-i18next";
import { instanceSchema, type IInstance } from "../../../types/instance.types";

export function useInstanceValidation(instance: Partial<IInstance>) {
  const { t } = useTranslation();

  const validate = (): string | null => {
    const result = instanceSchema.safeParse(instance);

    if (!result.success) {
      const errorKey = result.error.issues[0]?.message;
      return errorKey ? t(errorKey) : t("instanceFill.saveError");
    }

    return null;
  };

  return { validate };
}

