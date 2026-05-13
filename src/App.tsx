import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Transition from "./pages/Transition";
import NotFound from "./pages/NotFound";

const AdminLoginRoute = lazy(() => import("./pages/AdminLoginRoute"));
const AdminBoardRoute = lazy(() => import("./pages/AdminBoardRoute"));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
    <span className="animate-pulse">Loading...</span>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Transition />} />
      <Route path="/setup" element={<Navigate to="/" replace />} />

      {/* Hidden admin routes */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<RouteFallback />}>
            <AdminLoginRoute />
          </Suspense>
        }
      />
      <Route
        path="/admin/board-9k2x"
        element={
          <Suspense fallback={<RouteFallback />}>
            <AdminBoardRoute />
          </Suspense>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
