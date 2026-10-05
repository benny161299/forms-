import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useTranslation } from "react-i18next";
import { ConfirmProvider } from "material-ui-confirm";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";

import HomePage from "./pages/HomePage/HomePage";
import InstanceFillPage from "./pages/InstanceFillPage/InstanceFillPage";
import InstancesListPage from "./pages/InstancesListPage/InstancesListPage";
import SchemaBuilderPage from "./pages/SchemaBuilderPage/SchemaBuilderPage";
import SchemasListPage from "./pages/SchemasListPage/SchemasListPage";
import { theme } from "./theme/theme";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export function App() {
  const { t } = useTranslation();

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
      <CssBaseline />

      <ConfirmProvider
        defaultOptions={{
          title: t("common.confirmTitle"),
          confirmationText: t("common.confirm"),
          cancellationText: t("common.cancel"),
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/schemas" element={<SchemasListPage />} />
            <Route
              path="/schemas/create"
              element={<SchemaBuilderPage />}
            />
            <Route
              path="/schemas/edit/:id"
              element={<SchemaBuilderPage />}
            />

            <Route path="/instances" element={<InstancesListPage />} />
            <Route
              path="/instances/fill/:schemaId"
              element={<InstanceFillPage />}
            />
            <Route
              path="/instances/edit/:instanceId"
              element={<InstanceFillPage />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ConfirmProvider>

      <ToastContainer />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;