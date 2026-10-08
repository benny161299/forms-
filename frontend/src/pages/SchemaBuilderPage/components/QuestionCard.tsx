import { TextField, FormControlLabel, Switch } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { useTranslation } from "react-i18next";
import type { IQuestion, QuestionType } from "../../../types/schema.types";
import { QUESTION_TYPES } from "../../../types/schema.types";
import { QuestionTypeSelector } from "./QuestionTypeSelector";
import { EditableItemList } from "./EditableItemList";
import { ScaleRangeSelector } from "./ScaleRangeSelector";
import {
  CardContainer,
  ControlsRow,
  DeleteButton,
  RightControls,
} from "./SchemaBuilder.styles";

interface QuestionCardProps {
  question: IQuestion;
  onUpdate: (updated: IQuestion) => void;
  onDelete: () => void;
}

export const QuestionCard = ({ question, onUpdate, onDelete }: QuestionCardProps) => {
  const { t } = useTranslation();

  const handleTypeChange = (newType: QuestionType) => {
    const base = {
      id: question.id,
      title: question.title,
      required: question.required,
    };

    switch (newType) {
      case QUESTION_TYPES.SHORT_ANSWER:
      case QUESTION_TYPES.PARAGRAPH:
      case QUESTION_TYPES.TIME:
      case QUESTION_TYPES.DATE:
        onUpdate({ ...base, type: newType });
        break;

      case QUESTION_TYPES.RADIO:
      case QUESTION_TYPES.CHECKBOX:
      case QUESTION_TYPES.DROPDOWN:
        onUpdate({
          ...base,
          type: newType,
          options: { choices: [""] },
        });
        break;

      case QUESTION_TYPES.LINEAR_SCALE:
        onUpdate({
          ...base,
          type: newType,
          options: { min: 1, max: 5 },
        });
        break;

      case QUESTION_TYPES.RADIO_GRID:
      case QUESTION_TYPES.CHECKBOX_GRID:
        onUpdate({
          ...base,
          type: newType,
          options: { choices: [""], rows: [""] },
        });
        break;
    }
  };

  return (
    <CardContainer variant="outlined">
      <TextField
        fullWidth
        size="small"
        placeholder={t("schemaBuilder.questionTitlePlaceholder")}
        value={question.title}
        onChange={(e) => onUpdate({ ...question, title: e.target.value } as IQuestion)}
      />

      <ControlsRow>
        <QuestionTypeSelector value={question.type} onChange={handleTypeChange} />

        <RightControls>
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
          <DeleteButton onClick={onDelete} size="small">
            <DeleteOutlineIcon fontSize="small" />
          </DeleteButton>
        </RightControls>
      </ControlsRow>

      {question.type === QUESTION_TYPES.LINEAR_SCALE && (
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
    </CardContainer>
  );
}
