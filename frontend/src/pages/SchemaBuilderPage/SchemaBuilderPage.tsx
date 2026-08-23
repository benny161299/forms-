import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import type { Ischema } from "../../types/schema.types";
import { ApiError } from "../../api/axiosClient";
import { useCreateSchema } from "./hooks/useCreateSchema";
import { useUpdateSchema } from "./hooks/useUpdateSchema";
import { useSchemaById } from "./hooks/useSchemaById";
import { useSchemaValidation } from "./hooks/useSchemaValidation";
import { useSchemaBuilder } from "./hooks/useSchemaBuilder";
import { SectionCard } from "./components/SectionCard";
import * as S from "./SchemaBuilderPage.styles";

export function SchemaBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const { schema: fetchedSchema, isLoading: isFetching } = useSchemaById(id);
  const { createSchema, isCreating } = useCreateSchema();
  const { updateSchema, isUpdating } = useUpdateSchema();

  const actions = useSchemaBuilder(fetchedSchema);
  const { schema } = actions;
  const { validate } = useSchemaValidation(schema);

  const isSaving = isCreating || isUpdating;

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
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : t("schemaBuilder.saveError"));
    }
  };

  if (isFetching) {
    return (
      <S.PageContainer>
        <CircularProgress />
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <Typography variant="h4" color="primary" gutterBottom>
        {t(isEditMode ? "schemaBuilder.pageTitleEdit" : "schemaBuilder.pageTitleCreate")}
      </Typography>

      <S.HeaderPaper variant="outlined">
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
      </S.HeaderPaper>

      {schema.sections.map((section, sIdx) => (
        <SectionCard
          key={sIdx}
          section={section}
          sectionIndex={sIdx}
          onUpdateSection={(data) => actions.updateSection(sIdx, data)}
          onDeleteSection={() => actions.deleteSection(sIdx)}
          onAddQuestion={() => actions.addQuestion(sIdx)}
          onUpdateQuestion={(qIdx, q) => actions.updateQuestion(sIdx, qIdx, q)}
          onDeleteQuestion={(qIdx) => actions.deleteQuestion(sIdx, qIdx)}
        />
      ))}

      <S.ActionsFooter>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={actions.addSection}>
          {t("schemaBuilder.addSection")}
        </Button>

        <S.SaveActions>
          <Button variant="outlined" disabled={isSaving} onClick={() => handleSave(false)}>
            {t("schemaBuilder.saveDraft")}
          </Button>
          <Button variant="contained" disabled={isSaving} onClick={() => handleSave(true)}>
            {t("schemaBuilder.publish")}
          </Button>
        </S.SaveActions>
      </S.ActionsFooter>
    </S.PageContainer>
  );
}

export default SchemaBuilderPage;