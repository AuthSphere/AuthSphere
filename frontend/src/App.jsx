import { Suspense, useEffect } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { Toaster } from "sonner";
import { routes } from "./routes/routes";
import useAuthStore from "./store/authStore";
import ErrorBoundary from "./components/common/ErrorBoundary";

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex h-screen w-screen items-center justify-center font-mono text-xs text-muted-foreground">
              INITIALIZING ENCLAVE...
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
