import { Select, MenuItem, InputLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { QuestionType  } from "../../../types/schema.types";
import { questionTypes } from "../../../types/schema.types";
import * as S from "./SchemaBuilder.styles";

interface QuestionTypeSelectorProps {
  value: QuestionType;
  onChange: (type: QuestionType) => void;
}

export function QuestionTypeSelector({ value, onChange }: QuestionTypeSelectorProps) {
  const { t } = useTranslation();

  return (
    <S.QuestionTypeFormControl size="small">
      <InputLabel id="question-type-select-label">
        {t("schemaBuilder.questionType")}
      </InputLabel>
      <Select
        labelId="question-type-select-label"
        value={value}
        label={t("schemaBuilder.questionType")}
        onChange={(e) => onChange(e.target.value)}
      >
        {questionTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {t(`schemaBuilder.types.${type}`)}
          </MenuItem>
        ))}
      </Select>
    </S.QuestionTypeFormControl>
  );
}