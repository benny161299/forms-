import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instanceApi } from "../../api/instance.api";
import type { AnswerValue, IInstance } from "../../types/instance.types";
import type { Ischema } from "../../types/schema.types";
import { useSchemaById } from "../SchemaBuilderPage/hooks/useSchemaById";
import { useInstanceFill } from "./hooks/useInstanceFill";
import { useInstanceValidation } from "./hooks/useInstanceValidation";
import { QuestionAnswerField } from "./components/QuestionAnswerField";
import { InstanceFillFooter } from "./components/InstanceFillFooter";
import { BackToHomeButton } from "../../components/BackToHomeButton";
import { useRedirectIfFinalized } from "../../hooks/useRedirectIfFinalized";
import {
  PageContainer,
  SectionHeader,
} from "./InstanceFillPage.styles";

interface InstanceFillContentProps {
  schema: Ischema;
  initialInstance?: IInstance | null;
  schemaId?: string;
}

const InstanceFillContent = ({
  schema,
  initialInstance,
  schemaId,
}: InstanceFillContentProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = useMutation({
    mutationFn: (schemaIdToCreate: string) =>
      instanceApi.createInstance({ schemaId: schemaIdToCreate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draftInstances"] });
    },
    onError: () => {
      setIsSubmitting(false);
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
      let instance = await instanceApi.updateInstance(id, { answers });
      let submitFailed = false;

      if (submit) {
        try {
          instance = await instanceApi.submitInstance(id);
        } catch {
          submitFailed = true;
        }
      }

      return { instance, submit, submitFailed };
    },
    onSuccess: (data, variables) => {
      if (data.submitFailed) {
        queryClient.setQueryData(["instance", variables.id], data.instance);
        toast.error(t("instanceFill.submitFailedDraftSaved"));
        return;
      }

      if (!variables.submit) {
        queryClient.setQueryData(["instance", variables.id], data.instance);
      } else {
        queryClient.removeQueries({ queryKey: ["instance", variables.id] });
        queryClient.invalidateQueries({
          queryKey: ["submittedInstances"],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["draftInstances"],
      });
      toast.success(
        t(variables.submit ? "instanceFill.submitSuccess" : "instanceFill.draftSaveSuccess")
      );
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error(t("instanceFill.saveError"));
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const actions = useInstanceFill(initialInstance, schema.sections);
  const {
    instanceId: stateInstanceId,
    answers,
    currentSectionIndex,
    isFirstSection,
    isLastSection,
  } = actions;

  const currentSection = schema.sections[currentSectionIndex];
  const { validateSection, validateAll } = useInstanceValidation(
    schema.sections,
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

    setIsSubmitting(submit);

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
        setIsSubmitting(false);
        toast.error(t("instanceFill.saveError"));
        return;
      }

      updateMutation.mutate({ id: targetInstanceId, answers, submit });
    } catch {
      setIsSubmitting(false);
      toast.error(t("instanceFill.saveError"));
    }
  };

  if (!currentSection) {
    return (
      <PageContainer>
        <BackToHomeButton />
        <Typography variant="h6" color="text.secondary" align="center">
          {t("instanceFill.notFoundError")}
        </Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackToHomeButton disabled={isSaving} />

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
        isSubmitting={isSaving && isSubmitting}
        onPrev={handlePrev}
        onNext={handleNext}
        onSaveDraft={() => handleSave(false)}
        onSubmit={() => handleSave(true)}
      />
    </PageContainer>
  );
};

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
    isFetchedAfterMount: isInstanceFetchedAfterMount,
    isPaused: isInstancePaused,
    error: instanceError,
  } = useQuery({
    queryKey: ["instance", instanceId],
    queryFn: () => (instanceId ? instanceApi.getInstanceById(instanceId) : null),
    enabled: Boolean(instanceId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const schemaIdToFetch = isEditMode ? fetchedInstance?.schemaId : schemaId;
  const {
    schema,
    isFetchedAfterMount: isSchemaFetchedAfterMount,
    isPaused: isSchemaPaused,
    error: schemaError,
  } = useSchemaById(schemaIdToFetch);

  useEffect(() => {
    const isInstanceFailed = Boolean(isEditMode && instanceError && !fetchedInstance);
    const isSchemaFailed = Boolean(schemaIdToFetch && schemaError && !schema);

    if (isInstanceFailed || isSchemaFailed) {
      toast.error(t("instanceFill.notFoundError"));
      navigate("/", { replace: true });
    }
  }, [isEditMode, schemaIdToFetch, instanceError, schemaError, fetchedInstance, schema, navigate, t]);

  const isAlreadySubmitted = Boolean(isEditMode && fetchedInstance && !fetchedInstance.isDraft);
  useRedirectIfFinalized(isAlreadySubmitted, "instanceFill.alreadySubmitted");

  if (isAlreadySubmitted) {
    return null;
  }

  const isWaitingInstance =
    isEditMode && !instanceError && !isInstancePaused && !isInstanceFetchedAfterMount;
  const isWaitingSchema =
    Boolean(schemaIdToFetch) && !schemaError && !isSchemaPaused && !isSchemaFetchedAfterMount;

  if (isWaitingInstance || isWaitingSchema) {
    return (
      <PageContainer>
        <CircularProgress />
      </PageContainer>
    );
  }

  if (!schema) {
    return (
      <PageContainer>
        <BackToHomeButton />
        <Typography variant="h6" color="text.secondary" align="center">
          {t("instanceFill.notFoundError")}
        </Typography>
      </PageContainer>
    );
  }

  return (
    <InstanceFillContent
      key={instanceId || schemaIdToFetch}
      schema={schema}
      initialInstance={isEditMode ? fetchedInstance : null}
      schemaId={schemaIdToFetch}
    />
  );
};

export default InstanceFillPage;
