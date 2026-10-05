import { Modal, IconButton, Chip, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

import type { Ischema } from "../../types/schema.types";

import * as S from "./SchemasListPage.styles";

interface SchemaViewModalProps {
  schema: Ischema | null;
  onClose: () => void;
}

export function SchemaViewModal({ schema, onClose }: SchemaViewModalProps) {
  const { t } = useTranslation();

  if (!schema) {
    return null;
  }

  return (
    <Modal open onClose={onClose}>
      <S.ViewModalContainer>
        <S.ModalHeader>
          <Box>
            <S.ModalTitle variant="h5">{schema.title}</S.ModalTitle>

            {schema.description && (
              <S.ModalDescription variant="body2">
                {schema.description}
              </S.ModalDescription>
            )}
          </Box>

          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </S.ModalHeader>

        {schema.sections.map((section, sectionIndex) => (
          <S.SectionContainer key={section.title || sectionIndex}>
            <S.SectionPaper elevation={0} variant="outlined">
              <S.SectionTitle variant="subtitle1">{section.title}</S.SectionTitle>

              {section.description && (
                <S.SectionDescription variant="caption">
                  {section.description}
                </S.SectionDescription>
              )}
            </S.SectionPaper>

            <S.ChipsContainer>
              {section.questions.map((question) => (
                <Chip
                  key={question.id}
                  label={question.title}
                  size="small"
                  variant="outlined"
                  title={t(`schemaBuilder.types.${question.type}`)}
                />
              ))}
            </S.ChipsContainer>
          </S.SectionContainer>
        ))}
      </S.ViewModalContainer>
    </Modal>
  );
}
