import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schemaApi } from "../../api/schema.api";
import type { Ischema } from "../../types/schema.types";
import { useSchemaById } from "./hooks/useSchemaById";
import { useSchemaValidation } from "./hooks/useSchemaValidation";
import { useSchemaBuilder } from "./hooks/useSchemaBuilder";
import { SectionCard } from "./components/SectionCard";
import {
  ActionsFooter,
  HeaderPaper,
  HomeButton,
  PageContainer,
  SaveActions,
} from "./SchemaBuilderPage.styles";

export const SchemaBuilderPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const { schema: fetchedSchema, isLoading: isFetching, error: fetchError } = useSchemaById(id);

  useEffect(() => {
    if (isEditMode && (fetchError || (!isFetching && !fetchedSchema))) {
      toast.error(t("schemaBuilder.notFoundError"));
      navigate("/");
    }
  }, [isEditMode, fetchError, isFetching, fetchedSchema, navigate, t]);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async ({ schema, publish }: { schema: Ischema; publish: boolean }) => {
      const createdSchema = await schemaApi.createSchema(schema);

      if (publish && createdSchema._id) {
        await schemaApi.publishSchema(createdSchema._id);
      }

      return { createdSchema, publish };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["draftSchemas"] });
      queryClient.invalidateQueries({ queryKey: ["publishedSchemas"] });
      toast.success(
        t(variables.publish ? "schemaBuilder.publishSuccess" : "schemaBuilder.saveSuccess")
      );
      navigate("/");
    },
    onError: () => {
      toast.error(t("schemaBuilder.saveError"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      schema,
      publish,
    }: {
      id: string;
      schema: Ischema;
      publish: boolean;
    }) => {
      const updatedSchema = await schemaApi.updateSchema(id, schema);

      if (publish) {
        await schemaApi.publishSchema(id);
      }

      return { updatedSchema, publish };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["draftSchemas"] });
      queryClient.invalidateQueries({ queryKey: ["publishedSchemas"] });
      queryClient.invalidateQueries({ queryKey: ["schema", variables.id] });
      toast.success(
        t(variables.publish ? "schemaBuilder.publishSuccess" : "schemaBuilder.saveSuccess")
      );
      navigate("/");
    },
    onError: () => {
      toast.error(t("schemaBuilder.saveError"));
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const actions = useSchemaBuilder(fetchedSchema);
  const { schema } = actions;
  const { validate } = useSchemaValidation(schema);

  const saveSchema = (publish: boolean) => {
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload: Ischema = { ...schema, isDraft: !publish };

    if (isEditMode && id) {
      updateMutation.mutate({ id, schema: payload, publish });
    } else {
      createMutation.mutate({ schema: payload, publish });
    }
  };

  const handleSaveDraft = () => saveSchema(false);
  const handlePublish = () => saveSchema(true);

  if (isFetching) {
    return (
      <PageContainer>
        <CircularProgress />
      </PageContainer>
    );
  }

  if (isEditMode && !fetchedSchema) {
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
        <Typography variant="h6" color="text.secondary" align="center">
          {t("schemaBuilder.notFoundError")}
        </Typography>
      </PageContainer>
    );
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
        {t(isEditMode ? "schemaBuilder.pageTitleEdit" : "schemaBuilder.pageTitleCreate")}
      </Typography>

      <HeaderPaper variant="outlined">
        <TextField
          fullWidth
          variant="standard"
          placeholder={t("schemaBuilder.schemaTitlePlaceholder")}
          value={schema.title}
          onChange={(e) => actions.setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder={t("schemaBuilder.schemaDescPlaceholder")}
          value={schema.description || ""}
          onChange={(e) => actions.setDescription(e.target.value)}
        />
      </HeaderPaper>

      {schema.sections.map((section, sIdx) => (
        <SectionCard
          key={sIdx}
          section={section}
          sectionIndex={sIdx}
          isOnlySection={schema.sections.length <= 1}
          onUpdateSection={(data) => actions.updateSection(sIdx, data)}
          onDeleteSection={() => actions.deleteSection(sIdx)}
          onAddQuestion={() => actions.addQuestion(sIdx)}
          onUpdateQuestion={(qIdx, q) => actions.updateQuestion(sIdx, qIdx, q)}
          onDeleteQuestion={(qIdx) => actions.deleteQuestion(sIdx, qIdx)}
        />
      ))}

      <ActionsFooter>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={actions.addSection}>
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
    </PageContainer>
  );
};

export default SchemaBuilderPage;
