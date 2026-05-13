import { AuthProvider } from "@/contexts/AuthContext";
import AdminBoard from "./AdminBoard";

const AdminBoardRoute = () => (
  <AuthProvider>
    <AdminBoard />
  </AuthProvider>
);

export default AdminBoardRoute;
