import { useState, useEffect } from "react";
import {
  getTrajetsByChauffeur,
  updateTrajetStatut,
} from "../../services/trajetService";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaTruck,
  FaClock,
  FaCheckCircle,
  FaPlay,
} from "react-icons/fa";

const MesTrajets = () => {
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);

  // État pour le formulaire de fin de trajet
  const [finishingTrajet, setFinishingTrajet] = useState(null);
  const [formData, setFormData] = useState({ kmArrivee: "", volumeGasoil: "" });

  // Récupérer l'ID du user connecté
  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user?._id || user?.id;

const fetchTrajets = async () => {
  try {
    if (!userId) return; // Sécurité
    const res = await getTrajetsByChauffeur(userId);

      // 👇 AJOUTEZ CE LOG POUR VOIR CE QUE LE FRONT REÇOIT
      console.log("📦 Réponse API Front:", res);

      // Si votre service renvoie 'response.data', alors 'res' est l'objet { success, count, data }
      // Il faut donc accéder à res.data pour avoir le tableau
      if (res.success && Array.isArray(res.data)) {
        setTrajets(res.data);
      } else {
        // Cas où le service renvoie directement le tableau (dépend de votre service)
        setTrajets(Array.isArray(res) ? res : []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger vos trajets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrajets();
  }, []);

  // Action : Démarrer le trajet
  const handleStart = async (trajet) => {
    if (window.confirm("Démarrer ce trajet maintenant ?")) {
      try {
        // Vérification de sécurité pour le kilométrage
        const kmDepart = trajet.camionId?.kilometrage || trajet.kmDepart;

        await updateTrajetStatut(trajet._id, {
          statut: "en_cours",
          kmDepart: kmDepart,
        });
        toast.success("Bonne route ! Trajet démarré.");
        fetchTrajets();
      } catch (error) {
        console.error(error);
        toast.error("Erreur au démarrage");
      }
    }
  };

  // Action : Ouvrir le formulaire de fin
  const openFinishForm = (trajet) => {
    setFinishingTrajet(trajet);
    setFormData({ kmArrivee: "", volumeGasoil: "" });
  };

  // Action : Valider la fin du trajet
  const handleFinishSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTrajetStatut(finishingTrajet._id, {
        statut: "termine",
        kmArrivee: Number(formData.kmArrivee),
        volumeGasoil: Number(formData.volumeGasoil),
        dateArrivee: new Date(),
      });
      toast.success("Trajet terminé. Merci !");
      setFinishingTrajet(null);
      fetchTrajets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la clôture");
    }
  };

  if (loading)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Chargement des trajets...
      </div>
    );

  return (
    <div>
      <h1 style={{ color: "#2c3e50", marginBottom: "20px" }}>
        Bonjour, {user?.prenom || "Chauffeur"} 👋
      </h1>

      {/* Affichage si aucun trajet */}
      {!trajets || trajets.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>Aucun trajet assigné</h3>
          <p>Vous n'avez pas de course prévue pour le moment.</p>
        </div>
      ) : (
        /* Liste des trajets */
        <div style={styles.grid}>
          {trajets.map((t) => (
            <div key={t._id} style={styles.card}>
              <div style={styles.header}>
                <span style={getBadgeStyle(t.statut)}>
                  {t.statut.replace("_", " ").toUpperCase()}
                </span>
                <span style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>
                  {new Date(t.dateDepart).toLocaleDateString()}
                </span>
              </div>

              <div style={styles.route}>
                <FaMapMarkerAlt color="#e74c3c" />
                <div>
                  <strong>{t.pointDepart}</strong> <br />
                  <span style={{ fontSize: "0.8em" }}>vers</span> <br />
                  <strong>{t.pointArrivee}</strong>
                </div>
              </div>

              <div style={styles.info}>
                <p>
                  <FaTruck /> {t.camionId?.matricule} ({t.camionId?.marque})
                </p>
                {t.remorqueId && <p>🔗 Remorque: {t.remorqueId.matricule}</p>}
              </div>

              {/* Actions */}
              <div style={styles.actions}>
                {t.statut === "a_faire" && (
                  <button
                    onClick={() => handleStart(t)}
                    style={styles.startButton}
                  >
                    <FaPlay /> Démarrer
                  </button>
                )}

                {t.statut === "en_cours" && (
                  <button
                    onClick={() => openFinishForm(t)}
                    style={styles.finishButton}
                  >
                    <FaCheckCircle /> Terminer
                  </button>
                )}

                {t.statut === "termine" && (
                  <p
                    style={{
                      color: "green",
                      textAlign: "center",
                      width: "100%",
                      fontWeight: "bold",
                    }}
                  >
                    Trajet clôturé ✅
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Formulaire de fin de trajet */}
      {finishingTrajet && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Clôturer le trajet</h3>
            <p>
              {finishingTrajet.pointDepart} ➝ {finishingTrajet.pointArrivee}
            </p>

            <form onSubmit={handleFinishSubmit} style={styles.form}>
              <label>Kilométrage Arrivée :</label>
              <input
                type="number"
                required
                min={finishingTrajet.kmDepart}
                placeholder={`Min: ${finishingTrajet.kmDepart}`}
                value={formData.kmArrivee}
                onChange={(e) =>
                  setFormData({ ...formData, kmArrivee: e.target.value })
                }
                style={styles.input}
              />

              <label>Gasoil Consommé (L) :</label>
              <input
                type="number"
                required
                min="0"
                placeholder="Ex: 450"
                value={formData.volumeGasoil}
                onChange={(e) =>
                  setFormData({ ...formData, volumeGasoil: e.target.value })
                }
                style={styles.input}
              />

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setFinishingTrajet(null)}
                  style={styles.cancelButton}
                >
                  Annuler
                </button>
                <button type="submit" style={styles.confirmButton}>
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const getBadgeStyle = (statut) => {
  const base = {
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  };
  if (statut === "a_faire")
    return { ...base, backgroundColor: "#e2e3e5", color: "#383d41" };
  if (statut === "en_cours")
    return { ...base, backgroundColor: "#cce5ff", color: "#004085" };
  return { ...base, backgroundColor: "#d4edda", color: "#155724" };
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  emptyState: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "white",
    borderRadius: "10px",
    color: "#7f8c8d",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  route: {
    fontSize: "1.1rem",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    backgroundColor: "#f8f9fa",
    padding: "10px",
    borderRadius: "8px",
  },
  info: { color: "#555", marginBottom: "20px", lineHeight: "1.6", flex: 1 },
  actions: { display: "flex", gap: "10px", marginTop: "auto" },
  startButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "1rem",
  },
  finishButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "1rem",
  },

  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "400px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  input: {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  modalActions: { display: "flex", gap: "10px", marginTop: "10px" },
  cancelButton: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  confirmButton: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default MesTrajets;
