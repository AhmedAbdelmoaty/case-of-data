import { AuthProvider } from "@/contexts/AuthContext";
import AdminLogin from "./AdminLogin";

const AdminLoginRoute = () => (
  <AuthProvider>
    <AdminLogin />
  </AuthProvider>
);

export default AdminLoginRoute;
