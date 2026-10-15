import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";

const StyledHomeButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

interface BackToHomeButtonProps {
  disabled?: boolean;
}

export const BackToHomeButton = ({ disabled = false }: BackToHomeButtonProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <StyledHomeButton
      startIcon={<HomeIcon />}
      onClick={() => navigate("/")}
      variant="outlined"
      size="small"
      disabled={disabled}
    >
      {t("common.backToHome")}
    </StyledHomeButton>
  );
};
