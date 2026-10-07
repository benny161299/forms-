import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslation } from "react-i18next";
import { ActionsFooter, RightActions } from "../InstanceFillPage.styles";

interface InstanceFillFooterProps {
  isFirstSection: boolean;
  isLastSection: boolean;
  isSaving: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

export const InstanceFillFooter = ({
  isFirstSection,
  isLastSection,
  isSaving,
  onPrev,
  onNext,
  onSaveDraft,
  onSubmit,
}: InstanceFillFooterProps) => {
  const { t } = useTranslation();

  return (
    <ActionsFooter>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onPrev}
        disabled={isFirstSection || isSaving}
      >
        {t("instanceFill.back")}
      </Button>

      <RightActions>
        <Button
          variant="outlined"
          onClick={onSaveDraft}
          disabled={isSaving}
        >
          {t("instanceFill.saveDraft")}
        </Button>

        {isLastSection ? (
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={isSaving}
          >
            {isSaving ? t("instanceFill.submitting") : t("instanceFill.submit")}
          </Button>
        ) : (
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={onNext}
            disabled={isSaving}
          >
            {t("instanceFill.next")}
          </Button>
        )}
      </RightActions>
    </ActionsFooter>
  );
}