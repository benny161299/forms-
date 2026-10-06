import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import type { Ischema } from "../../types/schema.types";
import { useSchemaMutations } from "./hooks/useSchemaMutations";
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

export function SchemaBuilderPage() {
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

  const { createSchema, updateSchema, isSaving } = useSchemaMutations();

  const actions = useSchemaBuilder(fetchedSchema);
  const { schema } = actions;
  const { validate } = useSchemaValidation(schema);

  const handleSave = async (publish: boolean) => {
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const payload: Ischema = { ...schema, isDraft: !publish };

      if (isEditMode && id) {
        await updateSchema({ id, schema: payload, publish });
      } else {
        await createSchema({ schema: payload, publish });
      }

      toast.success(t(publish ? "schemaBuilder.publishSuccess" : "schemaBuilder.saveSuccess"));
      navigate("/");
    } catch {
      toast.error(t("schemaBuilder.saveError"));
    }
  };

  if (isFetching) {
    return (
      <PageContainer>
        <CircularProgress />
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
          <Button variant="outlined" disabled={isSaving} onClick={() => handleSave(false)}>
            {t("schemaBuilder.saveDraft")}
          </Button>
          <Button variant="contained" disabled={isSaving} onClick={() => handleSave(true)}>
            {t("schemaBuilder.publish")}
          </Button>
        </SaveActions>
      </ActionsFooter>
    </PageContainer>
  );
}

export default SchemaBuilderPage;