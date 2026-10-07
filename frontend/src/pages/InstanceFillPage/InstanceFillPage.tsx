
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, CircularProgress } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useSchemaById } from "../SchemaBuilderPage/hooks/useSchemaById";
import { useInstanceById } from "./hooks/useInstanceById";
import { useInstanceMutations } from "./hooks/useInstanceMutations";
import { useInstanceFill } from "./hooks/useInstanceFill";
import { useInstanceSectionValidation } from "./hooks/useInstanceSectionValidation";
import { useInstanceValidation } from "./hooks/useInstanceValidation";
import { QuestionAnswerField } from "./components/QuestionAnswerField";
import { InstanceFillFooter } from "./components/InstanceFillFooter";
import {
  HomeButton,
  PageContainer,
  SectionHeader,
} from "./InstanceFillPage.styles";

export const InstanceFillPage = () => {
  const { schemaId, instanceId } = useParams<{
    schemaId?: string;
    instanceId?: string;
  }>();
  const isEditMode = Boolean(instanceId);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    instance: fetchedInstance,
    isLoading: isLoadingInstance,
    error: instanceError,
  } = useInstanceById(instanceId);

  const schemaIdToFetch = isEditMode ? fetchedInstance?.schemaId : schemaId;
  const {
    schema,
    isLoading: isLoadingSchema,
    error: schemaError,
  } = useSchemaById(schemaIdToFetch);

  useEffect(() => {
    if (instanceError || schemaError) {
      toast.error(t("instanceFill.notFoundError"));
      navigate("/");
      return;
    }

    if (!isLoadingInstance && isEditMode && !fetchedInstance) {
      toast.error(t("instanceFill.notFoundError"));
      navigate("/");
      return;
    }

    if (!isLoadingSchema && schemaIdToFetch && !schema) {
      toast.error(t("instanceFill.notFoundError"));
      navigate("/");
      return;
    }
  }, [
    instanceError,
    schemaError,
    isLoadingInstance,
    isLoadingSchema,
    isEditMode,
    fetchedInstance,
    schemaIdToFetch,
    schema,
    navigate,
    t,
  ]);

  const { createInstance, updateInstance, isSaving } = useInstanceMutations();

  const actions = useInstanceFill(
    isEditMode ? fetchedInstance : null,
    schema?.sections
  );
  const {
    instanceId: stateInstanceId,
    answers,
    currentSectionIndex,
  } = actions;

  const totalSections = schema?.sections?.length ?? 0;
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = totalSections > 0 && currentSectionIndex === totalSections - 1;

  const currentSection = schema?.sections[currentSectionIndex];
  const { validateSection } = useInstanceSectionValidation(currentSection, answers);
  const { validateAll } = useInstanceValidation(schema?.sections, answers);

  const handleNext = () => {
    const error = validateSection();
    if (error) {
      toast.error(error);
      return;
    }
    actions.goToNextSection();
  };

  const handlePrev = () => {
    actions.goToPrevSection();
  };

  const handleSave = async (submit: boolean) => {
    if (submit) {
      const error = validateAll();
      if (error) {
        toast.error(error.message);
        actions.goToSection(error.sectionIndex);
        return;
      }
    }

    try {
      let targetInstanceId = stateInstanceId;

      if (!targetInstanceId && schemaId) {
        const created = await createInstance({ schemaId });
        targetInstanceId = created._id;
        if (targetInstanceId) {
          actions.setInstanceId(targetInstanceId);
        }
      }

      if (!targetInstanceId) {
        toast.error(t("instanceFill.saveError"));
        return;
      }

      await updateInstance({ id: targetInstanceId, answers, submit });

      toast.success(
        t(submit ? "instanceFill.submitSuccess" : "instanceFill.draftSaveSuccess")
      );

      navigate("/");
    } catch {
      toast.error(t("instanceFill.saveError"));
    }
  };

  if (isLoadingSchema || isLoadingInstance) {
    return (
      <PageContainer>
        <CircularProgress />
      </PageContainer>
    );
  }

  if (!schema || !currentSection) {
    return null;
  }

  return (
    <PageContainer>
      <HomeButton
        startIcon={<HomeIcon />}
        onClick={() => navigate("/")}
        variant="outlined"
        size="small"
      >
        {t("common.backToHome")}
      </HomeButton>

      <Typography variant="h4" color="primary" gutterBottom>
        {schema.title}
      </Typography>

      {schema.description && (
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {schema.description}
        </Typography>
      )}

      <SectionHeader variant="outlined">
        <Typography variant="h6">{currentSection.title}</Typography>
        {currentSection.description && (
          <Typography variant="body2" color="text.secondary">
            {currentSection.description}
          </Typography>
        )}
      </SectionHeader>

      {currentSection.questions.map((question) => (
        <QuestionAnswerField
          key={question.id}
          question={question}
          value={answers[question.id]}
          onChange={(value) => actions.setAnswer(question.id, value)}
          disabled={isSaving}
        />
      ))}

      <InstanceFillFooter
        isFirstSection={isFirstSection}
        isLastSection={isLastSection}
        isSaving={isSaving}
        onPrev={handlePrev}
        onNext={handleNext}
        onSaveDraft={() => handleSave(false)}
        onSubmit={() => handleSave(true)}
      />
    </PageContainer>
  );
};

export default InstanceFillPage;