import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, CircularProgress, Alert, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instanceApi } from "../../api/instance.api";
import { schemaApi } from "../../api/schema.api";
import type { AnswerValue, IInstance } from "../../types/instance.types";
import type { Ischema } from "../../types/schema.types";
import { useInstanceFill } from "./hooks/useInstanceFill";
import { useInstanceValidation } from "./hooks/useInstanceValidation";
import { QuestionAnswerField } from "./components/QuestionAnswerField";
import { InstanceFillFooter } from "./components/InstanceFillFooter";
import { BackToHomeButton } from "../../components/BackToHomeButton";
import { useRedirectIfFinalized } from "../../hooks/useRedirectIfFinalized";
import { useEntityPageGate } from "../../hooks/useEntityPageGate";
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

  const isSavingRef = useRef(false);

  const actions = useInstanceFill(initialInstance, schema.sections);
  const {
    instanceId: stateInstanceId,
    answers,
    currentSectionIndex,
    isFirstSection,
    isLastSection,
  } = actions;

  const saveMutation = useMutation({
    mutationFn: async ({
      answers,
      submit,
    }: {
      answers: Record<string, AnswerValue>;
      submit: boolean;
    }) => {
      let targetId = stateInstanceId;
      if (!targetId && schemaId) {
        const created = await instanceApi.createInstance({ schemaId });
        targetId = created._id;
        if (targetId) actions.setInstanceId(targetId);
      }
      if (!targetId) throw new Error("No instance id");

      let instance = await instanceApi.updateInstance(targetId, { answers });
      let submitFailed = false;

      if (submit) {
        try {
          instance = await instanceApi.submitInstance(targetId);
        } catch {
          submitFailed = true;
        }
      }

      return { instance, submit, submitFailed, id: targetId };
    },
    onSuccess: (data) => {
      if (data.submitFailed) {
        queryClient.setQueryData(["instance", data.id], data.instance);
        toast.error(t("instanceFill.submitFailedDraftSaved"));
        return;
      }

      if (!data.submit) {
        queryClient.setQueryData(["instance", data.id], data.instance);
      } else {
        queryClient.removeQueries({ queryKey: ["instance", data.id] });
        queryClient.invalidateQueries({ queryKey: ["submittedInstances"] });
      }

      queryClient.invalidateQueries({ queryKey: ["draftInstances"] });
      toast.success(
        t(data.submit ? "instanceFill.submitSuccess" : "instanceFill.draftSaveSuccess")
      );
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error(t("instanceFill.saveError"));
    },
    onSettled: () => {
      isSavingRef.current = false;
    },
  });

  const isSaving = saveMutation.isPending;
  const isSubmitting = saveMutation.isPending && saveMutation.variables?.submit === true;

  const currentSection = schema.sections[currentSectionIndex];
  const { validateAll } = useInstanceValidation(
    schema.sections,
    answers
  );

  const handleNext = () => {
    actions.goToNextSection();
  };

  const handlePrev = () => {
    actions.goToPrevSection();
  };

  const handleSave = (submit: boolean) => {
    if (isSavingRef.current) return;

    if (submit) {
      const error = validateAll();
      if (error) {
        toast.error(error.message);
        actions.goToSection(error.sectionIndex);
        return;
      }
    }

    isSavingRef.current = true;
    saveMutation.mutate({ answers, submit });
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

  const {
    data: fetchedInstance,
    isLoading: isInstanceLoading,
    isNotFound: isInstanceNotFound,
    isOtherError: isInstanceOtherError,
    refetch: refetchInstance,
  } = useEntityPageGate<IInstance>({
    queryKey: ["instance", instanceId],
    queryFn: () => (instanceId ? instanceApi.getInstanceById(instanceId) : null),
    enabled: isEditMode,
    notFoundMessageKey: "instanceFill.notFoundError",
  });

  const schemaIdToFetch = isEditMode ? fetchedInstance?.schemaId : schemaId;

  const {
    data: schema,
    isLoading: isSchemaLoading,
    isNotFound: isSchemaNotFound,
    isOtherError: isSchemaOtherError,
    refetch: refetchSchema,
  } = useEntityPageGate<Ischema>({
    queryKey: ["schema", schemaIdToFetch],
    queryFn: () => (schemaIdToFetch ? schemaApi.getSchemaById(schemaIdToFetch) : null),
    enabled: Boolean(schemaIdToFetch),
    notFoundMessageKey: "instanceFill.notFoundError",
  });

  const isAlreadySubmitted = Boolean(isEditMode && fetchedInstance && !fetchedInstance.isDraft);
  useRedirectIfFinalized(isAlreadySubmitted, "instanceFill.alreadySubmitted");

  const isSchemaDraft = Boolean(schema?.isDraft);
  useRedirectIfFinalized(isSchemaDraft, "instanceFill.schemaNotPublished");

  if (isAlreadySubmitted || isSchemaDraft || isInstanceNotFound || isSchemaNotFound) {
    return null;
  }

  if (isInstanceOtherError || isSchemaOtherError) {
    return (
      <PageContainer>
        <BackToHomeButton />
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                if (isInstanceOtherError) refetchInstance();
                if (isSchemaOtherError) refetchSchema();
              }}
            >
              {t("common.retry")}
            </Button>
          }
        >
          {t("instanceFill.fetchError")}
        </Alert>
      </PageContainer>
    );
  }

  if (isInstanceLoading || isSchemaLoading) {
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
