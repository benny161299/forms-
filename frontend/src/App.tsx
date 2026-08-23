import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ConfirmProvider } from "material-ui-confirm";

import HomePage from "./pages/HomePage/HomePage";
import InstanceFillPage from "./pages/InstanceFillPage";
import InstancesListPage from "./pages/InstancesListPage";
import SchemaBuilderPage from "./pages/SchemaBuilderPage/SchemaBuilderPage";
import SchemasListPage from "./pages/SchemasListPage";
import { theme } from "./theme/theme";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <ConfirmProvider>
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
  );
}

export default App;