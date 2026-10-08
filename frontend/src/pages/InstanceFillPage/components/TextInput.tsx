import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { QUESTION_TYPES, TEXT_QUESTION_TYPES } from "../../../types/schema.types";

type TextQuestionType = (typeof TEXT_QUESTION_TYPES)[number];

interface TextInputProps {
  type: TextQuestionType;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const TextInput = ({
  type,
  value = "",
  onChange,
  disabled,
}: TextInputProps) => {
  const { t } = useTranslation();
  const isParagraph = type === QUESTION_TYPES.PARAGRAPH;
  const isDateTime =
    type === QUESTION_TYPES.DATE || type === QUESTION_TYPES.TIME;
  const placeholder = isParagraph
    ? t("instanceFill.paragraphPlaceholder")
    : t("instanceFill.shortAnswerPlaceholder");

  return (
    <TextField
      fullWidth
      variant="outlined"
      multiline={isParagraph}
      rows={isParagraph ? 4 : 1}
      type={isDateTime ? type : "text"}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      slotProps={isDateTime ? { inputLabel: { shrink: true } } : undefined}
    />
  );
}
