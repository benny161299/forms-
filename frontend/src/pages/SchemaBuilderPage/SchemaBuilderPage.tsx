import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, CircularProgress, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schemaApi } from "../../api/schema.api";
import type { Ischema } from "../../types/schema.types";
import { useSchemaValidation } from "./hooks/useSchemaValidation";
import { useSchemaBuilder } from "./hooks/useSchemaBuilder";
import { SectionCard } from "./components/SectionCard";
import { BackToHomeButton } from "../../components/BackToHomeButton";
import { useRedirectIfFinalized } from "../../hooks/useRedirectIfFinalized";
import { useEntityPageGate } from "../../hooks/useEntityPageGate";
import {
  ActionsFooter,
  FormFieldSet,
  HeaderPaper,
  PageContainer,
  SaveActions,
} from "./SchemaBuilderPage.styles";

interface SchemaBuilderContentProps {
  id?: string;
  initialData?: Ischema | null;
}

const SchemaBuilderContent = ({ id, initialData }: SchemaBuilderContentProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [schemaId, setSchemaId] = useState<string | undefined>(id);
  const isSavingRef = useRef(false);
  const isEditMode = Boolean(schemaId);

  const saveMutation = useMutation({
    mutationFn: async ({
      targetId,
      payload,
      publish,
    }: {
      targetId?: string;
      payload: Ischema;
      publish: boolean;
    }) => {
      let currentId = targetId;
      let savedSchema: Ischema;

      if (currentId) {
        savedSchema = await schemaApi.updateSchema(currentId, payload);
      } else {
        savedSchema = await schemaApi.createSchema(payload);
        currentId = savedSchema._id;
        if (currentId) {
          setSchemaId(currentId);
        }
      }

      if (publish && currentId) {
        try {
          savedSchema = await schemaApi.publishSchema(currentId);
        } catch {
          return { savedSchema, publish, id: currentId, publishFailed: true };
        }
      }

      return { savedSchema, publish, id: currentId, publishFailed: false };
    },
    onSuccess: (data) => {
      if (data.publishFailed) {
        if (data.id) {
          queryClient.setQueryData(["schema", data.id], data.savedSchema);
        }
        toast.error(t("schemaBuilder.publishFailedDraftSaved"));
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["draftSchemas"] });
      if (data.publish) {
        queryClient.invalidateQueries({ queryKey: ["publishedSchemas"] });
      }
      if (data.id) {
        if (!data.publish) {
          queryClient.setQueryData(["schema", data.id], data.savedSchema);
        } else {
          queryClient.removeQueries({ queryKey: ["schema", data.id] });
        }
      }
      toast.success(
        t(data.publish ? "schemaBuilder.publishSuccess" : "schemaBuilder.saveSuccess")
      );
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error(t("schemaBuilder.saveError"));
    },
    onSettled: () => {
      isSavingRef.current = false;
    },
  });

  const isSaving = saveMutation.isPending;

  const actions = useSchemaBuilder(initialData);
  const {
    schema,
    setTitle,
    setDescription,
    addSection,
    updateSection,
    deleteSection,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  } = actions;
  const { validateDraft, validatePublish } = useSchemaValidation(schema);

  const saveSchema = (publish: boolean) => {
    if (isSavingRef.current) return;

    const validationError = publish ? validatePublish() : validateDraft();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    isSavingRef.current = true;
    const payload: Ischema = { ...schema, isDraft: !publish };
    saveMutation.mutate({ targetId: schemaId, payload, publish });
  };

  const handleSaveDraft = () => saveSchema(false);
  const handlePublish = () => saveSchema(true);

  return (
    <PageContainer>
      <BackToHomeButton disabled={isSaving} />

      <FormFieldSet disabled={isSaving}>
        <Typography variant="h4" color="primary" gutterBottom>
          {t(isEditMode ? "schemaBuilder.pageTitleEdit" : "schemaBuilder.pageTitleCreate")}
        </Typography>

        <HeaderPaper variant="outlined">
          <TextField
            fullWidth
            variant="standard"
            placeholder={t("schemaBuilder.schemaTitlePlaceholder")}
            value={schema.title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder={t("schemaBuilder.schemaDescPlaceholder")}
            value={schema.description || ""}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSaving}
          />
        </HeaderPaper>

        {schema.sections.map((section, sIdx) => (
          <SectionCard
            key={sIdx}
            section={section}
            sectionIndex={sIdx}
            isOnlySection={schema.sections.length <= 1}
            onUpdateSection={updateSection}
            onDeleteSection={deleteSection}
            onAddQuestion={addQuestion}
            onUpdateQuestion={updateQuestion}
            onDeleteQuestion={deleteQuestion}
          />
        ))}

        <ActionsFooter>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addSection}
            disabled={isSaving}
          >
            {t("schemaBuilder.addSection")}
          </Button>

          <SaveActions>
            <Button variant="outlined" disabled={isSaving} onClick={handleSaveDraft}>
              {t("schemaBuilder.saveDraft")}
            </Button>
            <Button variant="contained" disabled={isSaving} onClick={handlePublish}>
              {t("schemaBuilder.publish")}
            </Button>
          </SaveActions>
        </ActionsFooter>
      </FormFieldSet>
    </PageContainer>
  );
};

export const SchemaBuilderPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { t } = useTranslation();

  const {
    data: fetchedSchema,
    isLoading,
    isNotFound,
    isOtherError,
    refetch,
  } = useEntityPageGate<Ischema>({
    queryKey: ["schema", id],
    queryFn: () => (id ? schemaApi.getSchemaById(id) : null),
    enabled: isEditMode,
    notFoundMessageKey: "schemaBuilder.notFoundError",
  });

  const isAlreadyPublished = Boolean(isEditMode && fetchedSchema && !fetchedSchema.isDraft);
  useRedirectIfFinalized(isAlreadyPublished, "schemaBuilder.alreadyPublished");

  if (isAlreadyPublished || isNotFound) {
    return null;
  }

  if (isOtherError) {
    return (
      <PageContainer>
        <BackToHomeButton />
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
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <CircularProgress />
      </PageContainer>
    );
  }

  if (isEditMode && !fetchedSchema) {
    return (
      <PageContainer>
        <BackToHomeButton />
        <Typography variant="h6" color="text.secondary" align="center">
          {t("schemaBuilder.notFoundError")}
        </Typography>
      </PageContainer>
    );
  }

  return (
    <SchemaBuilderContent
      key={id || "new"}
      id={id}
      initialData={isEditMode ? fetchedSchema : null}
    />
  );
};

export default SchemaBuilderPage;
