import React, { useCallback } from "react";
import { TextField, FormControlLabel, Switch } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { useTranslation } from "react-i18next";
import type { IQuestion, QuestionType } from "../../../types/schema.types";
import { QUESTION_TYPES } from "../../../types/schema.types";
import type { QuestionUpdateData } from "../hooks/useSchemaBuilder";
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
  sectionIndex: number;
  questionIndex: number;
  onUpdateQuestion: (
    sectionIndex: number,
    questionIndex: number,
    updated: QuestionUpdateData
  ) => void;
  onDeleteQuestion: (sectionIndex: number, questionIndex: number) => void;
}

export const QuestionCard = React.memo(({
  question,
  sectionIndex,
  questionIndex,
  onUpdateQuestion,
  onDeleteQuestion,
}: QuestionCardProps) => {
  const { t } = useTranslation();

  const isGrid =
    question.type === QUESTION_TYPES.RADIO_GRID ||
    question.type === QUESTION_TYPES.CHECKBOX_GRID;

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateQuestion(sectionIndex, questionIndex, { title: e.target.value });
    },
    [onUpdateQuestion, sectionIndex, questionIndex]
  );

  const handleTypeChange = useCallback(
    (newType: QuestionType) => {
      onUpdateQuestion(sectionIndex, questionIndex, { type: newType });
    },
    [onUpdateQuestion, sectionIndex, questionIndex]
  );

  const handleRequiredChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateQuestion(sectionIndex, questionIndex, {
        required: e.target.checked,
      });
    },
    [onUpdateQuestion, sectionIndex, questionIndex]
  );

  const handleDelete = useCallback(() => {
    onDeleteQuestion(sectionIndex, questionIndex);
  }, [onDeleteQuestion, sectionIndex, questionIndex]);

  const handleScaleUpdate = useCallback(
    (min: number, max: number) => {
      onUpdateQuestion(sectionIndex, questionIndex, { options: { min, max } });
    },
    [onUpdateQuestion, sectionIndex, questionIndex]
  );

  const handleChoicesUpdate = useCallback(
    (choices: string[]) => {
      onUpdateQuestion(sectionIndex, questionIndex, { options: { choices } });
    },
    [onUpdateQuestion, sectionIndex, questionIndex]
  );

  const handleRowsUpdate = useCallback(
    (rows: string[]) => {
      onUpdateQuestion(sectionIndex, questionIndex, { options: { rows } });
    },
    [onUpdateQuestion, sectionIndex, questionIndex]
  );

  return (
    <CardContainer variant="outlined">
      <TextField
        fullWidth
        size="small"
        placeholder={t("schemaBuilder.questionTitlePlaceholder")}
        value={question.title}
        onChange={handleTitleChange}
      />

      <ControlsRow>
        <QuestionTypeSelector value={question.type} onChange={handleTypeChange} />

        <RightControls>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={question.required}
                onChange={handleRequiredChange}
              />
            }
            label={t("schemaBuilder.required")}
          />
          <DeleteButton onClick={handleDelete} size="small">
            <DeleteOutlineIcon fontSize="small" />
          </DeleteButton>
        </RightControls>
      </ControlsRow>

      {question.type === QUESTION_TYPES.LINEAR_SCALE && (
        <ScaleRangeSelector
          min={question.options.min}
          max={question.options.max}
          onUpdate={handleScaleUpdate}
        />
      )}

      {"options" in question && "choices" in question.options && (
        <EditableItemList
          titleKey={isGrid ? "schemaBuilder.gridColumns" : undefined}
          items={question.options.choices}
          placeholderKey={
            isGrid
              ? "schemaBuilder.gridColPlaceholder"
              : "schemaBuilder.choiceOptionPlaceholder"
          }
          addLabelKey={
            isGrid ? "schemaBuilder.addCol" : "schemaBuilder.addOption"
          }
          onUpdate={handleChoicesUpdate}
        />
      )}

      {"options" in question && "rows" in question.options && (
        <EditableItemList
          titleKey="schemaBuilder.gridRows"
          items={question.options.rows}
          placeholderKey="schemaBuilder.gridRowPlaceholder"
          addLabelKey="schemaBuilder.addRow"
          onUpdate={handleRowsUpdate}
        />
      )}
    </CardContainer>
  );
});
