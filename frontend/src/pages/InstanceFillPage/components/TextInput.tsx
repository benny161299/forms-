import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { QuestionType } from "../../../types/schema.types";

type TextQuestionType = Extract<
  QuestionType,
  "short_answer" | "paragraph" | "date" | "time"
>;

interface TextInputProps {
  type: TextQuestionType;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TextInput({
  type,
  value = "",
  onChange,
  disabled,
}: TextInputProps) {
  const { t } = useTranslation();
  const isParagraph = type === "paragraph";
  const isDateTime = type === "date" || type === "time";
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