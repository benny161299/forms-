import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const useRedirectIfFinalized = (
  shouldRedirect: boolean,
  messageKey: string
) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldRedirect) {
      toast.error(t(messageKey));
      navigate("/", { replace: true });
    }
  }, [shouldRedirect, messageKey, navigate, t]);
};
