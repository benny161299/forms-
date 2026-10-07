import { useTranslation } from "react-i18next";
import type { IQuestion } from "../../../types/schema.types";
import { QUESTION_TYPES } from "../../../types/schema.types";
import type { AnswerValue } from "../../../types/instance.types";
import { TextInput } from "./TextInput";
import { ChoiceInput } from "./ChoiceInput";
import { ScaleInput } from "./ScaleInput";
import { RadioGridInput } from "./RadioGridInput";
import { CheckboxGridInput } from "./CheckboxGridInput";
import {
  QuestionCardContainer,
  QuestionHeader,
  QuestionTitle,
  RequiredLabel,
} from "./InstanceFillComponents.styles";

interface QuestionAnswerFieldProps {
  question: IQuestion;
  value?: AnswerValue;
  onChange: (value: AnswerValue) => void;
  disabled?: boolean;
}

export const QuestionAnswerField = ({
  question,
  value,
  onChange,
  disabled,
}: QuestionAnswerFieldProps) => {
  const { t } = useTranslation();

  const renderInput = () => {
    switch (question.type) {
      case QUESTION_TYPES.SHORT_ANSWER:
      case QUESTION_TYPES.PARAGRAPH:
      case QUESTION_TYPES.DATE:
      case QUESTION_TYPES.TIME:
        return (
          <TextInput
            type={question.type}
            value={typeof value === "string" ? value : ""}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case QUESTION_TYPES.RADIO:
      case QUESTION_TYPES.CHECKBOX:
      case QUESTION_TYPES.DROPDOWN:
        return (
          <ChoiceInput
            type={question.type}
            id={question.id}
            choices={question.options.choices}
            value={
              typeof value === "string" || Array.isArray(value)
                ? value
                : undefined
            }
            onChange={onChange}
            disabled={disabled}
          />
        );

      case QUESTION_TYPES.LINEAR_SCALE:
        return (
          <ScaleInput
            min={question.options.min}
            max={question.options.max}
            value={typeof value === "number" ? value : undefined}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case QUESTION_TYPES.RADIO_GRID:
        return (
          <RadioGridInput
            rows={question.options.rows}
            choices={question.options.choices}
            value={typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, number>) : {}}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case QUESTION_TYPES.CHECKBOX_GRID:
        return (
          <CheckboxGridInput
            rows={question.options.rows}
            choices={question.options.choices}
            value={typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, number[]>) : {}}
            onChange={onChange}
            disabled={disabled}
          />
        );

      default: {
        return null;
      }
    }
  };

  return (
    <QuestionCardContainer variant="outlined">
      <QuestionHeader>
        <QuestionTitle variant="subtitle1">{question.title}</QuestionTitle>
        {question.required && (
          <RequiredLabel variant="caption">
            {t("instanceFill.requiredField")}
          </RequiredLabel>
        )}
      </QuestionHeader>
      {renderInput()}
    </QuestionCardContainer>
  );
}