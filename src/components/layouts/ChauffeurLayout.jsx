import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { FaTruck, FaSignOutAlt, FaList, FaUserCircle } from "react-icons/fa";

const ChauffeurLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer les infos du chauffeur stockées lors du login
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    // Nettoyage du stockage local
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirection vers le login
    navigate("/login");
  };

  // Fonction pour styliser le lien actif
  const getLinkStyle = (path) => {
    const isActive = location.pathname.includes(path);
    return {
      ...styles.link,
      backgroundColor: isActive ? "#34495e" : "transparent",
      borderLeft: isActive ? "4px solid #3498db" : "4px solid transparent",
    };
  };

  return (
    <div style={styles.container}>
      {/* Sidebar (Menu Gauche) */}
      <div style={styles.sidebar}>
        
        {/* Logo */}
        <div style={styles.logoSection}>
          <FaTruck size={28} color="#3498db" />
          <h2 style={styles.logoText}>TrackFlow</h2>
        </div>

        {/* Info Chauffeur */}
        <div style={styles.userSection}>
            <FaUserCircle size={40} color="#bdc3c7" />
            <div style={styles.userInfo}>
                <span style={styles.userName}>{user?.prenom} {user?.nom}</span>
                <span style={styles.userRole}>Chauffeur</span>
            </div>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          <Link to="/chauffeur/trajets" style={getLinkStyle("/chauffeur/trajets")}>
            <FaList /> Mes Trajets
          </Link>
        </nav>

        {/* Bouton Déconnexion (en bas) */}
        <button onClick={handleLogout} style={styles.logoutButton}>
          <FaSignOutAlt /> Déconnexion
        </button>
      </div>

      {/* Zone de Contenu Principal (Dynamique) */}
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f4f6f8",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#2c3e50",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #34495e",
  },
  logoText: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "30px",
    padding: "10px",
    backgroundColor: "#34495e",
    borderRadius: "8px",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontWeight: "bold",
    fontSize: "0.95rem",
  },
  userRole: {
    fontSize: "0.8rem",
    color: "#bdc3c7",
    textTransform: "uppercase",
  },
  nav: {
    flex: 1, // Prend tout l'espace disponible pour pousser le bouton logout en bas
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "12px 15px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "1rem",
    transition: "background 0.3s",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontSize: "1rem",
    marginTop: "20px",
    transition: "background 0.3s",
  },
  content: {
    flex: 1,
    padding: "30px",
    overflowY: "auto", // Permet de scroller si le contenu est long
  },
};

export default ChauffeurLayout;