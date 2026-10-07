import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instanceApi } from "../../../api/instance.api";
import type { AnswerValue } from "../../../types/instance.types";

interface CreateInstanceParams {
  schemaId: string;
}

interface UpdateInstanceParams {
  id: string;
  answers: Record<string, AnswerValue>;
  submit: boolean;
}

export function useInstanceMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ({ schemaId }: CreateInstanceParams) =>
      instanceApi.createInstance({ schemaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instances"] });
      queryClient.invalidateQueries({ queryKey: ["draftInstances"] });
      queryClient.invalidateQueries({ queryKey: ["submittedInstances"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      answers,
      submit,
    }: UpdateInstanceParams) => {
      const updatedInstance = await instanceApi.updateInstance(
        id,
        { answers }
      );

      if (submit) {
        await instanceApi.submitInstance(id);
      }

      return { updatedInstance, submit };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["instance", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["draftInstances"],
      });
      queryClient.invalidateQueries({
        queryKey: ["submittedInstances"],
      });
      queryClient.invalidateQueries({
        queryKey: ["instances"],
      });
    },
  });

  return {
    createInstance: createMutation.mutateAsync,
    updateInstance: updateMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
