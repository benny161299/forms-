import { TextField, FormControlLabel, Switch } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { useTranslation } from "react-i18next";
import type { IQuestion, QuestionType } from "../../../types/schema.types";
import { QuestionTypeSelector } from "./QuestionTypeSelector";
import { EditableItemList } from "./EditableItemList";
import { ScaleRangeSelector } from "./ScaleRangeSelector";
import * as S from "./SchemaBuilder.styles";

interface QuestionCardProps {
  question: IQuestion;
  onUpdate: (updated: IQuestion) => void;
  onDelete: () => void;
}

export function QuestionCard({ question, onUpdate, onDelete }: QuestionCardProps) {
  const { t } = useTranslation();

  const handleTypeChange = (newType: QuestionType) => {
    const base = {
      id: question.id,
      title: question.title,
      required: question.required,
    };

    switch (newType) {
      case "short_answer":
      case "paragraph":
      case "time":
      case "date":
        onUpdate({ ...base, type: newType });
        break;

      case "radio":
      case "checkbox":
      case "dropdown":
        onUpdate({
          ...base,
          type: newType,
          options: { choices: [""] },
        });
        break;

      case "linear_scale":
        onUpdate({
          ...base,
          type: newType,
          options: { min: 1, max: 5 },
        });
        break;

      case "radio_grid":
      case "checkbox_grid":
        onUpdate({
          ...base,
          type: newType,
          options: { choices: [""], rows: [""] },
        });
        break;
    }
  };

  return (
    <S.CardContainer variant="outlined">
      <TextField
        fullWidth
        size="small"
        placeholder={t("schemaBuilder.questionTitlePlaceholder")}
        value={question.title}
        onChange={(e) => onUpdate({ ...question, title: e.target.value } as IQuestion)}
      />

      <S.ControlsRow>
        <QuestionTypeSelector value={question.type} onChange={handleTypeChange} />

        <S.RightControls>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={question.required}
                onChange={(e) =>
                  onUpdate({ ...question, required: e.target.checked } as IQuestion)
                }
              />
            }
            label={t("schemaBuilder.required")}
          />
          <S.DeleteButton onClick={onDelete} size="small">
            <DeleteOutlineIcon fontSize="small" />
          </S.DeleteButton>
        </S.RightControls>
      </S.ControlsRow>

      {question.type === "linear_scale" && (
        <ScaleRangeSelector
          min={question.options.min}
          max={question.options.max}
          onUpdate={(min, max) =>
            onUpdate({ ...question, options: { min, max } })
          }
        />
      )}

      {"options" in question && "choices" in question.options && (
        <EditableItemList
          items={question.options.choices}
          placeholderKey="schemaBuilder.choiceOptionPlaceholder"
          addLabelKey="schemaBuilder.addOption"
          onUpdate={(choices) =>
            onUpdate({
              ...question,
              options: { ...question.options, choices },
            } as IQuestion)
          }
        />
      )}

      {"options" in question && "rows" in question.options && (
        <EditableItemList
          items={question.options.rows}
          placeholderKey="schemaBuilder.gridRowPlaceholder"
          addLabelKey="schemaBuilder.addRow"
          onUpdate={(rows) =>
            onUpdate({
              ...question,
              options: { ...question.options, rows },
            } as IQuestion)
          }
        />
      )}
    </S.CardContainer>
  );
}