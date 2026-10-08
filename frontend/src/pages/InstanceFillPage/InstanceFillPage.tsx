
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, CircularProgress } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instanceApi } from "../../api/instance.api";
import type { AnswerValue } from "../../types/instance.types";
import { useSchemaById } from "../SchemaBuilderPage/hooks/useSchemaById";
import { useInstanceFill } from "./hooks/useInstanceFill";
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
    data: fetchedInstance,
    isLoading: isLoadingInstance,
    error: instanceError,
  } = useQuery({
    queryKey: ["instance", instanceId],
    queryFn: () => (instanceId ? instanceApi.getInstanceById(instanceId) : null),
    enabled: Boolean(instanceId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

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

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (schemaId: string) => instanceApi.createInstance({ schemaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instances"] });
      queryClient.invalidateQueries({ queryKey: ["draftInstances"] });
      queryClient.invalidateQueries({ queryKey: ["submittedInstances"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      answers,
      submit,
    }: {
      id: string;
      answers: Record<string, AnswerValue>;
      submit: boolean;
    }) => {
      const updatedInstance = await instanceApi.updateInstance(id, { answers });

      if (submit) {
        await instanceApi.submitInstance(id);
      }

      return { updatedInstance, submit };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["instance", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["draftInstances"],
      });
      queryClient.invalidateQueries({
        queryKey: ["submittedInstances"],
      });
      queryClient.invalidateQueries({
        queryKey: ["instances"],
      });
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

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
  const { validateSection, validateAll } = useInstanceValidation(
    schema?.sections,
    answers
  );

  const handleNext = () => {
    const error = validateSection(currentSection);
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
        const created = await createMutation.mutateAsync(schemaId);
        targetInstanceId = created._id;
        if (targetInstanceId) {
          actions.setInstanceId(targetInstanceId);
        }
      }

      if (!targetInstanceId) {
        toast.error(t("instanceFill.saveError"));
        return;
      }

      await updateMutation.mutateAsync({ id: targetInstanceId, answers, submit });

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