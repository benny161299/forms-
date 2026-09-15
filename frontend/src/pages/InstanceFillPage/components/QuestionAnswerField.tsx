import { useTranslation } from "react-i18next";
import type { IQuestion } from "../../../types/schema.types";
import type { AnswerValue } from "../../../types/instance.types";
import { TextInput } from "./TextInput";
import { ChoiceInput } from "./ChoiceInput";
import { ScaleInput } from "./ScaleInput";
import { RadioGridInput } from "./RadioGridInput";
import { CheckboxGridInput } from "./CheckboxGridInput";
import * as S from "./InstanceFillComponents.styles";

interface QuestionAnswerFieldProps {
  question: IQuestion;
  value?: AnswerValue;
  onChange: (value: AnswerValue) => void;
  disabled?: boolean;
}

export function QuestionAnswerField({
  question,
  value,
  onChange,
  disabled,
}: QuestionAnswerFieldProps) {
  const { t } = useTranslation();

  const renderInput = () => {
    switch (question.type) {
      case "short_answer":
      case "paragraph":
      case "date":
      case "time":
        return (
          <TextInput
            type={question.type}
            value={typeof value === "string" ? value : ""}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case "radio":
      case "checkbox":
      case "dropdown":
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

      case "linear_scale":
        return (
          <ScaleInput
            min={question.options.min}
            max={question.options.max}
            value={typeof value === "number" ? value : undefined}
            onChange={onChange}
            disabled={disabled}
          />
        );

     case "radio_grid":
        return (
          <RadioGridInput
            rows={question.options.rows}
            choices={question.options.choices}
            value={typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, number>) : {}}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case "checkbox_grid":
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
    <S.QuestionCardContainer variant="outlined">
      <S.QuestionHeader>
        <S.QuestionTitle variant="subtitle1">{question.title}</S.QuestionTitle>
        {question.required && (
          <S.RequiredLabel variant="caption">
            {t("instanceFill.requiredField")}
          </S.RequiredLabel>
        )}
      </S.QuestionHeader>
      {renderInput()}
    </S.QuestionCardContainer>
  );
}