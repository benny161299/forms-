import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schemaApi } from "../../../api/schema.api";
import type { Ischema } from "../../../types/schema.types";

interface CreateSchemaParams {
  schema: Ischema;
  publish: boolean;
}

interface UpdateSchemaParams {
  id: string;
  schema: Ischema;
  publish: boolean;
}

export function useSchemaMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async ({ schema, publish }: CreateSchemaParams) => {
      const createdSchema = await schemaApi.createSchema(schema);

      if (publish && createdSchema._id) {
        await schemaApi.publishSchema(createdSchema._id);
      }

      return { createdSchema, publish };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draftSchemas"] });
      queryClient.invalidateQueries({ queryKey: ["publishedSchemas"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, schema, publish }: UpdateSchemaParams) => {
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
    },
  });

  return {
    createSchema: createMutation.mutateAsync,
    updateSchema: updateMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
