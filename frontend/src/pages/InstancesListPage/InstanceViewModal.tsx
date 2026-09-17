import {
  Modal,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useSchemaById } from "../SchemaBuilderPage/hooks/useSchemaById";
import { QuestionAnswerField } from "../InstanceFillPage/components/QuestionAnswerField";

import type { IInstance } from "../../types/instance.types";

import * as S from "./InstancesListPage.styles";

interface InstanceViewModalProps {
  instance: IInstance | null;
  onClose: () => void;
}

export function InstanceViewModal({
  instance,
  onClose,
}: InstanceViewModalProps) {
  const { schema, isLoading } = useSchemaById(instance?.schemaId);

  if (!instance) {
    return null;
  }

  return (
    <Modal open onClose={onClose}>
      <S.ViewModalContainer>
        <S.ModalHeader>
          <Box>
            <S.ModalTitle variant="h5">
              {schema?.title}
            </S.ModalTitle>

            {schema?.description && (
              <S.ModalDescription variant="body2">
                {schema.description}
              </S.ModalDescription>
            )}
          </Box>

          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </S.ModalHeader>

        {isLoading ? (
          <S.ModalLoadingContainer>
            <CircularProgress />
          </S.ModalLoadingContainer>
        ) : (
          schema?.sections.map((section, sectionIndex) => (
            <S.SectionContainer
              key={section.title || sectionIndex}
            >
              <S.SectionPaper elevation={0} variant="outlined">
                <S.SectionTitle variant="subtitle1">
                  {section.title}
                </S.SectionTitle>

                {section.description && (
                  <S.SectionDescription variant="caption">
                    {section.description}
                  </S.SectionDescription>
                )}
              </S.SectionPaper>

              {section.questions.map((question) => (
                <QuestionAnswerField
                  key={question.id}
                  question={question}
                  value={instance.answers?.[question.id]}
                  onChange={() => {}}
                  disabled
                />
              ))}
            </S.SectionContainer>
          ))
        )}
      </S.ViewModalContainer>
    </Modal>
  );
}
