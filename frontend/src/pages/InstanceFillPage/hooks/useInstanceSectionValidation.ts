import { useTranslation } from "react-i18next";
import type { IQuestion, ISection } from "../../../types/schema.types";
import type { AnswerValue } from "../../../types/instance.types";

function isAnswerMissing(
  question: IQuestion,
  value: AnswerValue | undefined
): boolean {
  if (value === undefined || value === null) {
    return true;
  }

  switch (question.type) {
    case "short_answer":
    case "paragraph":
    case "date":
    case "time":
    case "radio":
    case "dropdown":
      return typeof value !== "string" || value.trim() === "";

    case "checkbox":
      return !Array.isArray(value) || value.length === 0;

    case "linear_scale":
      return typeof value !== "number";

    case "radio_grid": {
      const record = value as Record<string, number>;

      return question.options.rows.some(
        (row) => record[row] === undefined
      );
    }

    case "checkbox_grid": {
      const record = value as Record<string, number[]>;

      return question.options.rows.some(
        (row) => !Array.isArray(record[row]) || record[row].length === 0
      );
    }

    default:
      return false;
  }
}

export function useInstanceSectionValidation(
  section: ISection | undefined,
  answers: Record<string, AnswerValue>
) {
  const { t } = useTranslation();

  const validateSection = (): string | null => {
    if (!section) {
      return null;
    }

    for (const question of section.questions) {
      if (!question.required) {
        continue;
      }

      const answer = answers[question.id];

      if (isAnswerMissing(question, answer)) {
        return t("instanceFill.requiredField");
      }
    }

    return null;
  };

  return {
    validateSection,
  };
}
