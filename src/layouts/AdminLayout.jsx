import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { FaTruckLoading, FaCircleNotch } from 'react-icons/fa'; 
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaTruck,
  FaRoute,
  FaTools,
  FaUsers,
  FaSignOutAlt,
  FaHome,
  FaChartPie,
} from "react-icons/fa";

const AdminLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: <FaChartPie />, label: "Vue d'ensemble" },
    { path: "/admin/camions", icon: <FaTruck />, label: "Camions" },
    { path: '/admin/remorques', icon: <FaTruckLoading />, label: 'Remorques' },
    { path: '/admin/pneus', icon: <FaCircleNotch />, label: 'Pneus' },
    { path: "/admin/trajets", icon: <FaRoute />, label: "Trajets" },
    { path: "/admin/maintenance", icon: <FaTools />, label: "Maintenance" },
    { path: "/admin/chauffeurs", icon: <FaUsers />, label: "Chauffeurs" },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <h2 style={styles.logo}>
            Track<span style={{ color: "#3498db" }}>Flow</span>
          </h2>
          <p style={styles.roleBadge}>Espace Admin</p>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                ...(location.pathname === item.path
                  ? styles.activeNavItem
                  : {}),
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={styles.footer}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{user?.prenom?.charAt(0)}</div>
            <div>
              <p style={styles.userName}>
                {user?.prenom} {user?.nom}
              </p>
              <p style={styles.userEmail}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <FaSignOutAlt />
          </button>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main style={styles.mainContent}>
        <Outlet /> {/* C'est ici que les pages enfants s'afficheront */}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    fontFamily: "'Segoe UI', sans-serif",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100vh",
    left: 0,
    top: 0,
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  },
  logoContainer: {
    padding: "20px",
    textAlign: "center",
    borderBottom: "1px solid #34495e",
  },
  logo: {
    margin: 0,
    fontSize: "1.5rem",
  },
  roleBadge: {
    fontSize: "0.8rem",
    backgroundColor: "#34495e",
    padding: "2px 8px",
    borderRadius: "4px",
    display: "inline-block",
    marginTop: "5px",
    color: "#bdc3c7",
  },
  nav: {
    flex: 1,
    padding: "20px 0",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    color: "#bdc3c7",
    textDecoration: "none",
    transition: "all 0.3s",
    borderLeft: "4px solid transparent",
  },
  activeNavItem: {
    backgroundColor: "#34495e",
    color: "#fff",
    borderLeft: "4px solid #3498db",
  },
  icon: {
    marginRight: "10px",
    fontSize: "1.1rem",
  },
  footer: {
    padding: "20px",
    borderTop: "1px solid #34495e",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "35px",
    height: "35px",
    backgroundColor: "#3498db",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    margin: 0,
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  userEmail: {
    margin: 0,
    fontSize: "0.7rem",
    color: "#95a5a6",
  },
  logoutButton: {
    background: "none",
    border: "none",
    color: "#e74c3c",
    cursor: "pointer",
    fontSize: "1.2rem",
    padding: "5px",
  },
  mainContent: {
    flex: 1,
    marginLeft: "260px", // Marge égale à la largeur de la sidebar
    padding: "30px",
    overflowY: "auto",
  },
};

export default AdminLayout;
