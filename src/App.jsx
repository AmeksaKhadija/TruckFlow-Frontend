import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages Publiques
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Layouts & Pages Admin
import AdminLayout from "./layouts/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import Camions from "./pages/admin/Camions";
import Trajets from "./pages/admin/Trajets";
import Remorques from "./pages/admin/Remorques";
import Pneus from "./pages/admin/Pneus";
import Maintenance from "./pages/admin/Maintenance";
import Chauffeurs from "./pages/admin/Chauffeurs";

// Layout Chauffeur
import ChauffeurLayout from "./components/layouts/ChauffeurLayout";
import MesTrajets from "./pages/chauffeur/MesTrajets";

// Protection des routes
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  // Si un rôle est requis et que l'utilisateur ne l'a pas, redirection
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" />
        <Routes>
          {/* Routes Publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🛡️ ROUTES ADMIN */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="camions" element={<Camions />} />
            <Route path="trajets" element={<Trajets />} />
            <Route path="remorques" element={<Remorques />} />
            <Route path="pneus" element={<Pneus />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="chauffeurs" element={<Chauffeurs />} />
          </Route>

          {/* 🛡️ ROUTES CHAUFFEUR (Corrigées) */}
          <Route
            path="/chauffeur"
            element={
              <PrivateRoute role="chauffeur">
                <ChauffeurLayout />
              </PrivateRoute>
            }
          >
            {/* ✅ Redirection automatique : /chauffeur -> /chauffeur/trajets */}
            <Route
              index
              element={<Navigate to="/chauffeur/trajets" replace />}
            />
            <Route path="trajets" element={<MesTrajets />} />
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
