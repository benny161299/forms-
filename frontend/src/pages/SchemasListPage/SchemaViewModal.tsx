import { Modal, IconButton, Chip, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

import type { Ischema } from "../../types/schema.types";

import {
  ViewModalContainer,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  SectionContainer,
  SectionPaper,
  SectionTitle,
  SectionDescription,
  ChipsContainer,
} from "./SchemasListPage.styles";

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
      <ViewModalContainer>
        <ModalHeader>
          <Box>
            <ModalTitle variant="h5">{schema.title}</ModalTitle>

            {schema.description && (
              <ModalDescription variant="body2">
                {schema.description}
              </ModalDescription>
            )}
          </Box>

          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </ModalHeader>

        {schema.sections.map((section, sectionIndex) => (
          <SectionContainer key={section.title || sectionIndex}>
            <SectionPaper elevation={0} variant="outlined">
              <SectionTitle variant="subtitle1">{section.title}</SectionTitle>

              {section.description && (
                <SectionDescription variant="caption">
                  {section.description}
                </SectionDescription>
              )}
            </SectionPaper>

            <ChipsContainer>
              {section.questions.map((question) => (
                <Chip
                  key={question.id}
                  label={question.title}
                  size="small"
                  variant="outlined"
                  title={t(`schemaBuilder.types.${question.type}`)}
                />
              ))}
            </ChipsContainer>
          </SectionContainer>
        ))}
      </ViewModalContainer>
    </Modal>
  );
}
