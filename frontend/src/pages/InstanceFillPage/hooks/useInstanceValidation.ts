import { useTranslation } from "react-i18next";
import type { ISection } from "../../../types/schema.types";
import type { AnswerValue } from "../../../types/instance.types";
import { isAnswerMissing } from "./useInstanceSectionValidation";

export interface InstanceValidationError {
  message: string;
  sectionIndex: number;
}

export function useInstanceValidation(
  sections: ISection[] | undefined,
  answers: Record<string, AnswerValue>
) {
  const { t } = useTranslation();

  const validateAll = (): InstanceValidationError | null => {
    if (!sections || sections.length === 0) {
      return null;
    }

    for (let sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
      const section = sections[sectionIdx];
      for (const question of section.questions) {
        if (!question.required) {
          continue;
        }

        const answer = answers[question.id];
        if (isAnswerMissing(question, answer)) {
          return {
            message: t("instanceFill.requiredField"),
            sectionIndex: sectionIdx,
          };
        }
      }
    }

    return null;
  };

  return { validateAll };
}
