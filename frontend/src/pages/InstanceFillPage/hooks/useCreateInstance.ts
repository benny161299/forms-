import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instanceApi } from "../../../api/instance.api";

interface CreateInstanceParams {
  schemaId: string;
}

export function useCreateInstance() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ schemaId }: CreateInstanceParams) => {
      return await instanceApi.createInstance({ schemaId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instances"] });
      queryClient.invalidateQueries({ queryKey: ["draftInstances"] });
      queryClient.invalidateQueries({ queryKey: ["submittedInstances"] });
    },
  });

  return {
    createInstance: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
}