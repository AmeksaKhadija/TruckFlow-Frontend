import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getMaintenanceAlerts,
  getAllRegles,
  createRegle,
  updateRegle,
  deleteRegle,
} from "../../services/maintenanceService";
import { toast } from "react-toastify";
import {
  FaTools,
  FaExclamationTriangle,
  FaCog,
  FaTrash,
  FaPlus,
  FaTruck,
  FaTruckLoading,
  FaEdit,
} from "react-icons/fa";

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState("alertes"); // 'alertes' ou 'regles'
  const [alertes, setAlertes] = useState([]);
  const [regles, setRegles] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  // Chargement des données
  const fetchData = async () => {
    try {
      if (activeTab === "alertes") {
        const res = await getMaintenanceAlerts();
        setAlertes(res.data);
      } else {
        const res = await getAllRegles();
        setRegles(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur de chargement des données");
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Création d'une règle
  const onSubmitReglee = async (data) => {
    try {
      // Conversion des chaînes vides en null pour l'API
      const payload = {
        ...data,
        intervalleKm: data.intervalleKm || null,
        intervalleTempsMois: data.intervalleTempsMois || null,
      };

      await createRegle(payload);
      toast.success("Règle de maintenance créée !");
      reset();
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur création règle");
    }
  };

  const handleEditRegle = (regle) => {
    setEditingId(regle._id);
    setValue("typeEntretien", regle.typeEntretien);
    setValue("categorieVehicule", regle.categorieVehicule);
    setValue("intervalleKm", regle.intervalleKm);
    setValue("intervalleTempsMois", regle.intervalleTempsMois);
    setValue("seuilAlerteKm", regle.seuilAlerteKm);
    setValue("description", regle.description);
    setShowForm(true);
  };

  const onSubmitRegle = async (data) => {
    try {
      const payload = {
        ...data,
        intervalleKm: data.intervalleKm || null,
        intervalleTempsMois: data.intervalleTempsMois || null,
      };

      if (editingId) {
        await updateRegle(editingId, payload); // ✅ Update
        toast.success("Règle modifiée");
      } else {
        await createRegle(payload); // ✅ Create
        toast.success("Règle créée");
      }
      reset();
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (error) {
      /*...*/
    }
  };
  // Suppression d'une règle
  const handleDeleteRegle = async (id) => {
    if (window.confirm("Supprimer cette règle ?")) {
      try {
        await deleteRegle(id);
        toast.success("Règle supprimée");
        fetchData();
      } catch (error) {
        toast.error("Erreur suppression");
      }
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "20px", color: "#2c3e50" }}>
        Centre de Maintenance
      </h1>

      {/* Onglets de navigation */}
      <div style={styles.tabs}>
        <button
          style={activeTab === "alertes" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("alertes")}
        >
          <FaExclamationTriangle /> Alertes en cours
        </button>
        <button
          style={activeTab === "regles" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("regles")}
        >
          <FaCog /> Configuration des Règles
        </button>
      </div>

      {/* --- CONTENU ONGLET ALERTES --- */}
      {activeTab === "alertes" && (
        <div style={styles.container}>
          {alertes.length === 0 ? (
            <div style={styles.emptyState}>
              <FaTools size={40} color="#bdc3c7" />
              <p>Aucune alerte de maintenance. Tout roule ! 🚛</p>
            </div>
          ) : (
            <div style={styles.gridAlertes}>
              {alertes.map((alerte, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.cardAlerte,
                    borderLeft: `5px solid ${
                      alerte.gravite === "CRITIQUE" ? "#e74c3c" : "#f39c12"
                    }`,
                  }}
                >
                  <div style={styles.headerAlerte}>
                    <span style={styles.badgeVehicule}>
                      {alerte.typeVehicule === "Camion" ? (
                        <FaTruck />
                      ) : (
                        <FaTruckLoading />
                      )}{" "}
                      {alerte.matricule}
                    </span>
                    <span
                      style={{
                        color:
                          alerte.gravite === "CRITIQUE" ? "#e74c3c" : "#f39c12",
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                      }}
                    >
                      {alerte.gravite}
                    </span>
                  </div>
                  <h3 style={{ margin: "10px 0", color: "#2c3e50" }}>
                    {alerte.typeEntretien.toUpperCase()}
                  </h3>
                  <p style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
                    {alerte.message}
                  </p>
                  <div style={styles.footerAlerte}>
                    <small>Échéance : {alerte.echeance}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- CONTENU ONGLET RÈGLES --- */}
      {activeTab === "regles" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() => setShowForm(!showForm)}
              style={styles.addButton}
            >
              <FaPlus /> {showForm ? "Fermer" : "Nouvelle Règle"}
            </button>
          </div>

          {/* Formulaire Ajout Règle */}
          {showForm && (
            <div style={styles.formCard}>
              <h3 style={{ marginTop: 0 }}>Définir une périodicité</h3>
              <form onSubmit={handleSubmit(onSubmitRegle)} style={styles.form}>
                <div style={styles.formGroup}>
                  <label>Type d'entretien</label>
                  <select
                    {...register("typeEntretien")}
                    style={styles.input}
                    required
                  >
                    <option value="vidange">Vidange</option>
                    <option value="pneus">Pneus</option>
                    <option value="revision">Révision</option>
                    <option value="freins">Freins</option>
                    <option value="technique">Contrôle Technique</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label>Véhicule concerné</label>
                  <select
                    {...register("categorieVehicule")}
                    style={styles.input}
                    required
                  >
                    <option value="Camion">Camion</option>
                    <option value="Remorque">Remorque</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label>Intervalle (km)</label>
                  <input
                    type="number"
                    {...register("intervalleKm")}
                    placeholder="Ex: 20000"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>Intervalle (Mois)</label>
                  <input
                    type="number"
                    {...register("intervalleTempsMois")}
                    placeholder="Ex: 12"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>Alerte avant (km)</label>
                  <input
                    type="number"
                    {...register("seuilAlerteKm")}
                    defaultValue={1000}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label>Description</label>
                  <input
                    {...register("description")}
                    placeholder="Détails..."
                    style={styles.input}
                  />
                </div>

                <button type="submit" style={styles.submitButton}>
                  Enregistrer la règle
                </button>
              </form>
            </div>
          )}

          {/* Liste des Règles */}
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={{ backgroundColor: "#ecf0f1" }}>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Catégorie</th>
                  <th style={styles.th}>Fréquence</th>
                  <th style={styles.th}>Alerte</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {regles.map((r) => (
                  <tr key={r._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={styles.td}>
                      <strong>{r.typeEntretien}</strong>
                    </td>
                    <td style={styles.td}>{r.categorieVehicule}</td>
                    <td style={styles.td}>
                      {r.intervalleKm && (
                        <div>
                          🏁 Tous les {r.intervalleKm.toLocaleString()} km
                        </div>
                      )}
                      {r.intervalleTempsMois && (
                        <div>📅 Tous les {r.intervalleTempsMois} mois</div>
                      )}
                    </td>
                    <td style={styles.td}>Avant {r.seuilAlerteKm} km</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleEditRegle(r)}
                        style={styles.editButton}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteRegle(r._id)}
                        style={styles.deleteButton}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles CSS-in-JS
const styles = {
  tabs: { display: "flex", gap: "10px", marginBottom: "20px" },
  tab: {
    padding: "10px 20px",
    border: "none",
    background: "#ecf0f1",
    cursor: "pointer",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#7f8c8d",
  },
  activeTab: {
    padding: "10px 20px",
    border: "none",
    background: "#3498db",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  container: { marginTop: "20px" },
  emptyState: {
    textAlign: "center",
    padding: "50px",
    color: "#95a5a6",
    backgroundColor: "white",
    borderRadius: "10px",
  },
  gridAlertes: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  cardAlerte: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  headerAlerte: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgeVehicule: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "#ecf0f1",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.85rem",
    color: "#2c3e50",
  },
  footerAlerte: {
    marginTop: "15px",
    paddingTop: "10px",
    borderTop: "1px solid #eee",
    color: "#7f8c8d",
    fontSize: "0.85rem",
  },

  // Styles Formulaire & Table (similaires aux autres pages)
  addButton: {
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  formCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "5px" },
  submitButton: {
    gridColumn: "1 / -1",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "15px",
    textAlign: "left",
    color: "#7f8c8d",
    borderBottom: "2px solid #ecf0f1",
  },
  td: { padding: "15px", color: "#2c3e50" },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  editButton: { 
    backgroundColor: '#f39c12', // Orange
    color: 'white', 
    border: 'none', 
    padding: '8px', 
    borderRadius: '5px', 
    cursor: 'pointer',
    marginRight: '5px'
},
};

export default Maintenance;
