import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CircularProgress, Typography, Button } from "@mui/material";

import { ConfirmDialog } from "../../../components/ConfirmDialog";
import {
  SectionPaper,
  CarouselWrapper,
  SectionLoadingContainer,
  SectionErrorText,
  SectionErrorContainer,
  RetryButton,
} from "../HomePage.styles";

interface DraftsSectionBaseProps<T extends { _id?: string }> {
  title: string;
  queryKey: readonly string[];
  queryFn: () => Promise<T[]>;
  deleteFn: (id: string) => Promise<unknown>;
  errorMessage: string;
  emptyMessage: string;
  deleteSuccessMessage: string;
  deleteErrorMessage: string;
  confirmDeleteTitle: string;
  confirmDeleteDescription: string;
  renderItem: (item: T, index: number, requestDelete: (id: string) => void) => ReactNode;
}

export const DraftsSectionBase = <T extends { _id?: string }>({
  title,
  queryKey,
  queryFn,
  deleteFn,
  errorMessage,
  emptyMessage,
  deleteSuccessMessage,
  deleteErrorMessage,
  confirmDeleteTitle,
  confirmDeleteDescription,
  renderItem,
}: DraftsSectionBaseProps<T>) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn,
  });

  const items = data ?? [];
  const hasData = data !== undefined;
  const isError = Boolean(error);

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<T[]>(queryKey);
      queryClient.setQueryData<T[]>(queryKey, (old) =>
        old ? old.filter((item) => item._id !== id) : []
      );
      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error(deleteErrorMessage);
    },
    onSuccess: () => {
      toast.success(deleteSuccessMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <SectionPaper variant="outlined">
        <Typography variant="h6" color="secondary" gutterBottom>
          {title}
        </Typography>

        {loading ? (
          <SectionLoadingContainer>
            <CircularProgress size={32} />
          </SectionLoadingContainer>
        ) : isError && !hasData ? (
          <>
            <SectionErrorText variant="body2">
              {errorMessage}
            </SectionErrorText>
            <RetryButton size="small" onClick={() => refetch()}>
              {t("common.retry")}
            </RetryButton>
          </>
        ) : items.length === 0 ? (
          <>
            {isError && (
              <SectionErrorContainer>
                <SectionErrorText variant="body2">
                  {errorMessage}
                </SectionErrorText>
                <Button size="small" onClick={() => refetch()}>
                  {t("common.retry")}
                </Button>
              </SectionErrorContainer>
            )}
            <Typography variant="body2" color="text.secondary">
              {emptyMessage}
            </Typography>
          </>
        ) : (
          <>
            {isError && (
              <SectionErrorContainer>
                <SectionErrorText variant="body2">
                  {errorMessage}
                </SectionErrorText>
                <Button size="small" onClick={() => refetch()}>
                  {t("common.retry")}
                </Button>
              </SectionErrorContainer>
            )}
            <CarouselWrapper>
              {items.map((item, index) => renderItem(item, index, setDeleteId))}
            </CarouselWrapper>
          </>
        )}
      </SectionPaper>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title={confirmDeleteTitle}
        description={confirmDeleteDescription}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </>
  );
};
