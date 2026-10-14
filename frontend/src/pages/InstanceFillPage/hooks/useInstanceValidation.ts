import { useTranslation } from "react-i18next";
import type { IQuestion, ISection } from "../../../types/schema.types";
import { QUESTION_TYPES } from "../../../types/schema.types";
import type { AnswerValue } from "../../../types/instance.types";

export interface InstanceValidationError {
  message: string;
  sectionIndex: number;
}

export function isAnswerMissing(
  question: IQuestion,
  value: AnswerValue | undefined
): boolean {
  if (value === undefined || value === null) {
    return true;
  }

  switch (question.type) {
    case QUESTION_TYPES.SHORT_ANSWER:
    case QUESTION_TYPES.PARAGRAPH:
    case QUESTION_TYPES.DATE:
    case QUESTION_TYPES.TIME:
    case QUESTION_TYPES.RADIO:
    case QUESTION_TYPES.DROPDOWN:
      return typeof value !== "string" || value.trim() === "";

    case QUESTION_TYPES.CHECKBOX:
      return !Array.isArray(value) || value.length === 0;

    case QUESTION_TYPES.LINEAR_SCALE:
      return typeof value !== "number";

    case QUESTION_TYPES.RADIO_GRID: {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return true;
      }
      const record = value as Record<string, number>;

      return question.options.rows.some(
        (row) => !Object.hasOwn(record, row) || typeof record[row] !== "number"
      );
    }

    case QUESTION_TYPES.CHECKBOX_GRID: {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return true;
      }
      const record = value as Record<string, number[]>;

      return question.options.rows.some(
        (row) =>
          !Object.hasOwn(record, row) ||
          !Array.isArray(record[row]) ||
          record[row].length === 0
      );
    }

    default:
      return false;
  }
}

export function useInstanceValidation(
  sections: ISection[] | undefined,
  answers: Record<string, AnswerValue>
) {
  const { t } = useTranslation();

  const validateSection = (section: ISection | undefined): string | null => {
    if (!section) {
      return null;
    }

    for (const question of section.questions) {
      if (question.required && isAnswerMissing(question, answers[question.id])) {
        return t("instanceFill.requiredField");
      }
    }

    return null;
  };

  const validateAll = (): InstanceValidationError | null => {
    if (!sections || sections.length === 0) {
      return null;
    }

    for (let sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
      const section = sections[sectionIdx];
      const error = validateSection(section);
      if (error) {
        return {
          message: error,
          sectionIndex: sectionIdx,
        };
      }
    }

    return null;
  };

  return { validateSection, validateAll };
}
