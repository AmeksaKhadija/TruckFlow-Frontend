import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaTruckMoving,
  FaTools,
  FaRoute,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Variantes pour les animations
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div style={styles.pageContainer}>
      {/* Arrière-plan animé */}
      <div style={styles.backgroundOverlay}></div>

      <motion.div
        style={styles.glassCard}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* En-tête avec Logo animé */}
        <header style={styles.header}>
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <FaTruckMoving size={60} color="#3498db" />
          </motion.div>
          <h1 style={styles.title}>
            Track<span style={{ color: "#3498db" }}>Flow</span>
          </h1>
          <p style={styles.subtitle}>
            Gestion intelligente de flotte & maintenance
          </p>
        </header>

        <main style={styles.mainContent}>
          {user ? (
            // 🟢 SECTION CONNECTÉ
            <motion.div
              style={styles.authSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div style={styles.welcomeBadge}>
                <FaUserCircle size={24} />
                <span>Bonjour, {user.prenom} !</span>
              </div>

              <p style={{ marginBottom: "20px", color: "#555" }}>
                Prêt à gérer vos opérations ?
              </p>

              <div style={styles.buttonGroup}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    navigate(
                      user.role === "admin"
                        ? "/admin/dashboard"
                        : "/chauffeur/dashboard"
                    )
                  }
                  style={styles.primaryButton}
                >
                  <FaRoute style={{ marginRight: "8px" }} /> Accéder au
                  Dashboard
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#c0392b" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  style={styles.logoutButton}
                >
                  <FaSignOutAlt style={{ marginRight: "8px" }} /> Déconnexion
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // 🔴 SECTION NON CONNECTÉ
            <motion.div
              style={styles.authSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div style={styles.featuresGrid}>
                <motion.div
                  variants={itemVariants}
                  transition={{ delay: 0.4 }}
                  style={styles.featureItem}
                >
                  <FaRoute color="#2ecc71" /> Suivi Trajets
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  transition={{ delay: 0.5 }}
                  style={styles.featureItem}
                >
                  <FaTools color="#e67e22" /> Maintenance
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  transition={{ delay: 0.6 }}
                  style={styles.featureItem}
                >
                  <FaTruckMoving color="#9b59b6" /> Flotte
                </motion.div>
              </div>

              <div style={styles.buttonGroup}>
                <Link
                  to="/login"
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 0px 8px rgb(52, 152, 219)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={styles.primaryButton}
                  >
                    Se connecter
                  </motion.button>
                </Link>

                <Link
                  to="/register"
                  style={{ textDecoration: "none", width: "100%" }}
                >
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(52, 152, 219, 0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={styles.outlineButton}
                  >
                    Créer un compte
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </main>
      </motion.div>

      {/* Footer discret */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={styles.footer}
      >
        © 2025 TrackFlow Logistics
      </motion.footer>
    </div>
  );
};

// Styles CSS-in-JS
const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Beau dégradé bleu
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  // Effet de verre (Glassmorphism)
  glassCard: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "50px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    textAlign: "center",
    zIndex: 10,
  },
  header: {
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "2.5rem",
    margin: "10px 0 5px 0",
    color: "#2c3e50",
    fontWeight: "800",
    letterSpacing: "-1px",
  },
  subtitle: {
    color: "#7f8c8d",
    fontSize: "1.1rem",
    margin: 0,
  },
  mainContent: {
    width: "100%",
  },
  authSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  welcomeBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#e8f4fd",
    color: "#3498db",
    padding: "10px 20px",
    borderRadius: "50px",
    fontWeight: "bold",
  },
  featuresGrid: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: "20px",
    color: "#555",
    fontSize: "0.9rem",
  },
  featureItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
  },
  primaryButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
  },
  logoutButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
  },
  outlineButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "transparent",
    color: "#3498db",
    border: "2px solid #3498db",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  footer: {
    marginTop: "30px",
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.9rem",
  },
};

export default Home;
