import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instanceApi } from "../../../api/instance.api";
import type { AnswerValue } from "../../../types/instance.types";

interface UpdateInstanceParams {
  id: string;
  answers: Record<string, AnswerValue>;
  submit: boolean;
}

export function useUpdateInstance() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
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
    },
  });

  return {
    updateInstance: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}