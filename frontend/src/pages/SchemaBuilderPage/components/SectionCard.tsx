import React, { useCallback } from "react";
import { TextField, Button, Typography, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { useTranslation } from "react-i18next";
import type { ISection } from "../../../types/schema.types";
import type { QuestionUpdateData } from "../hooks/useSchemaBuilder";
import { QuestionCard } from "./QuestionCard";
import {
  InputsContainer,
  QuestionsWrapper,
  SectionHeader,
  SectionPaper,
} from "./SchemaBuilder.styles";

interface SectionCardProps {
  section: ISection;
  sectionIndex: number;
  isOnlySection?: boolean;
  onUpdateSection: (sectionIndex: number, updated: Partial<ISection>) => void;
  onDeleteSection: (sectionIndex: number) => void;
  onAddQuestion: (sectionIndex: number) => void;
  onUpdateQuestion: (
    sectionIndex: number,
    questionIndex: number,
    updated: QuestionUpdateData
  ) => void;
  onDeleteQuestion: (sectionIndex: number, questionIndex: number) => void;
}

export const SectionCard = React.memo(({
  section,
  sectionIndex,
  isOnlySection,
  onUpdateSection,
  onDeleteSection,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}: SectionCardProps) => {
  const { t } = useTranslation();

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateSection(sectionIndex, { title: e.target.value });
    },
    [onUpdateSection, sectionIndex]
  );

  const handleDescChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateSection(sectionIndex, { description: e.target.value });
    },
    [onUpdateSection, sectionIndex]
  );

  const handleDeleteSection = useCallback(() => {
    onDeleteSection(sectionIndex);
  }, [onDeleteSection, sectionIndex]);

  const handleAddQuestion = useCallback(() => {
    onAddQuestion(sectionIndex);
  }, [onAddQuestion, sectionIndex]);

  return (
    <SectionPaper variant="outlined">
      <SectionHeader>
        <InputsContainer>
          <Typography variant="subtitle1" color="primary">
            {t("home.sectionsCount", { count: sectionIndex + 1 })}
          </Typography>
          <TextField
            fullWidth
            placeholder={t("schemaBuilder.sectionTitlePlaceholder")}
            value={section.title}
            onChange={handleTitleChange}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder={t("schemaBuilder.sectionDescPlaceholder")}
            value={section.description}
            onChange={handleDescChange}
          />
        </InputsContainer>
        <Tooltip title={isOnlySection ? t("schemaBuilder.cannotDeleteOnlySection") : ""}>
          <span>
            <Button
              color="error"
              variant="text"
              startIcon={<DeleteOutlineIcon />}
              onClick={handleDeleteSection}
              disabled={isOnlySection}
            >
              {t("schemaBuilder.deleteSection")}
            </Button>
          </span>
        </Tooltip>
      </SectionHeader>

      <QuestionsWrapper>
        {section.questions.map((question, qIdx) => (
          <QuestionCard
            key={question.id}
            question={question}
            sectionIndex={sectionIndex}
            questionIndex={qIdx}
            onUpdateQuestion={onUpdateQuestion}
            onDeleteQuestion={onDeleteQuestion}
          />
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddQuestion}
        >
          {t("schemaBuilder.addQuestion")}
        </Button>
      </QuestionsWrapper>
    </SectionPaper>
  );
});
