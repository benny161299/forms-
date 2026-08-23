import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schemaApi } from "../../../api/schema.api";
import type { Ischema } from "../../../types/schema.types";

interface CreateSchemaParams {
  schema: Ischema;
  publish: boolean;
}

export function useCreateSchema() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
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

  return {
    createSchema: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
}