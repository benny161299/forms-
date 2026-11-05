import {
  Modal,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

import { useSchemaById } from "../SchemaBuilderPage/hooks/useSchemaById";
import { QuestionAnswerField } from "../InstanceFillPage/components/QuestionAnswerField";

import type { IInstance } from "../../types/instance.types";

import {
  ModalDescription,
  ModalHeader,
  ModalLoadingContainer,
  ModalTitle,
  SectionContainer,
  SectionDescription,
  SectionPaper,
  SectionTitle,
  ViewModalContainer,
} from "./InstancesListPage.styles";

interface InstanceViewModalProps {
  instance: IInstance | null;
  onClose: () => void;
}

export const InstanceViewModal = ({
  instance,
  onClose,
}: InstanceViewModalProps) => {
  const { t } = useTranslation();
  const { schema, isPending, isError, refetch } = useSchemaById(instance?.schemaId);

  if (!instance) {
    return null;
  }

  return (
    <Modal open onClose={onClose}>
      <ViewModalContainer>
        <ModalHeader>
          <Box>
            <ModalTitle variant="h5">
              {schema?.title || t("listPages.view")}
            </ModalTitle>

            {schema?.description && (
              <ModalDescription variant="body2">
                {schema.description}
              </ModalDescription>
            )}
          </Box>

          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </ModalHeader>

        {isPending ? (
          <ModalLoadingContainer>
            <CircularProgress />
          </ModalLoadingContainer>
        ) : isError || !schema ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                {t("common.retry")}
              </Button>
            }
          >
            {t("errors.fetchSchema")}
          </Alert>
        ) : (
          schema.sections.map((section, sectionIndex) => (
            <SectionContainer
              key={sectionIndex}
            >
              <SectionPaper elevation={0} variant="outlined">
                <SectionTitle variant="subtitle1">
                  {section.title}
                </SectionTitle>

                {section.description && (
                  <SectionDescription variant="caption">
                    {section.description}
                  </SectionDescription>
                )}
              </SectionPaper>

              {section.questions.map((question) => (
                <QuestionAnswerField
                  key={question.id}
                  question={question}
                  value={instance.answers?.[question.id]}
                  onChange={() => {}}
                  disabled
                />
              ))}
            </SectionContainer>
          ))
        )}
      </ViewModalContainer>
    </Modal>
  );
};
