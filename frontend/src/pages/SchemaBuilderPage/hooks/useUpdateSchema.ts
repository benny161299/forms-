import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schemaApi } from "../../../api/schema.api";
import type { Ischema } from "../../../types/schema.types";

interface UpdateSchemaParams {
  id: string;
  schema: Ischema;
  publish: boolean;
}

export function useUpdateSchema() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
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
    updateSchema: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}