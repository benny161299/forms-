import { TextField, Button, Typography, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { useTranslation } from "react-i18next";
import type { ISection, IQuestion } from "../../../types/schema.types";
import { QuestionCard } from "./QuestionCard";
import * as S from "./SchemaBuilder.styles";

interface SectionCardProps {
  section: ISection;
  sectionIndex: number;
  isOnlySection?: boolean;
  onUpdateSection: (updated: Partial<ISection>) => void;
  onDeleteSection: () => void;
  onAddQuestion: () => void;
  onUpdateQuestion: (questionIndex: number, updated: IQuestion) => void;
  onDeleteQuestion: (questionIndex: number) => void;
}

export function SectionCard({
  section,
  sectionIndex,
  isOnlySection,
  onUpdateSection,
  onDeleteSection,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}: SectionCardProps) {
  const { t } = useTranslation();

  return (
    <S.SectionPaper variant="outlined">
      <S.SectionHeader>
        <S.InputsContainer>
          <Typography variant="subtitle1" color="primary">
            {t("home.sectionsCount", { count: sectionIndex + 1 })}
          </Typography>
          <TextField
            fullWidth
            placeholder={t("schemaBuilder.sectionTitlePlaceholder")}
            value={section.title}
            onChange={(e) => onUpdateSection({ title: e.target.value })}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder={t("schemaBuilder.sectionDescPlaceholder")}
            value={section.description}
            onChange={(e) => onUpdateSection({ description: e.target.value })}
          />
        </S.InputsContainer>
        <Tooltip title={isOnlySection ? t("schemaBuilder.cannotDeleteOnlySection") : ""}>
          <span>
            <Button
              color="error"
              variant="text"
              startIcon={<DeleteOutlineIcon />}
              onClick={onDeleteSection}
              disabled={isOnlySection}
            >
              {t("schemaBuilder.deleteSection")}
            </Button>
          </span>
        </Tooltip>
      </S.SectionHeader>

      <S.QuestionsWrapper>
        {section.questions.map((question, qIdx) => (
          <QuestionCard
            key={question.id}
            question={question}
            onUpdate={(updated) => onUpdateQuestion(qIdx, updated)}
            onDelete={() => onDeleteQuestion(qIdx)}
          />
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAddQuestion}
        >
          {t("schemaBuilder.addQuestion")}
        </Button>
      </S.QuestionsWrapper>
    </S.SectionPaper>
  );
}