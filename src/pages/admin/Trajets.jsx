import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getAllTrajets,
  createTrajet,
  updateTrajet,
  deleteTrajet,
} from "../../services/trajetService";
// Assurez-vous d'avoir ces services ou adaptez les imports
import { getAllCamions } from "../../services/camionService";
import { getAllRemorques } from "../../services/remorqueService";
import { getAllChauffeurs } from "../../services/chauffeurService"; // ✅ Import du service user
import { toast } from "react-toastify";
import {
  FaTrash,
  FaMapMarkerAlt,
  FaUser,
  FaTruck,
  FaPlus,
  FaEdit,
} from "react-icons/fa";

const Trajets = () => {
  const [trajets, setTrajets] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [camions, setCamions] = useState([]);
  const [remorques, setRemorques] = useState([]);

  const { register, handleSubmit, reset, setValue } = useForm();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Chargement des données (Trajets + Listes déroulantes)
  const fetchData = async () => {
    try {
      const [trajetsRes, chauffeursRes, camionsRes, remorquesRes] =
        await Promise.all([
          getAllTrajets(),
          getAllChauffeurs(),
          getAllCamions(),
          getAllRemorques(),
        ]);

      setTrajets(trajetsRes.data);
      setChauffeurs(chauffeursRes.data);
      setCamions(camionsRes.data);
      setRemorques(remorquesRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Erreur chargement des données");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Pré-remplir le formulaire pour modification
  const handleEdit = (trajet) => {
    setEditingId(trajet._id);
    setValue("pointDepart", trajet.pointDepart);
    setValue("pointArrivee", trajet.pointArrivee);
    // Formatage de la date pour l'input type="date" (YYYY-MM-DD)
    setValue(
      "dateDepart",
      trajet.dateDepart ? new Date(trajet.dateDepart).toISOString().split("T")[0] : ""
    );
    setValue("kmDepart", trajet.kmDepart);
    setValue("chauffeurId", trajet.chauffeurId?._id || trajet.chauffeurId);
    setValue("camionId", trajet.camionId?._id || trajet.camionId);
    setValue("remorqueId", trajet.remorqueId?._id || trajet.remorqueId);
    setValue("remarques", trajet.remarques);
    setShowForm(true);
  };

  // ✅ Réinitialiser pour création
  const handleAddNew = () => {
    setEditingId(null);
    reset();
    setShowForm(!showForm);
  };

  // ✅ Gestion Submit (Create / Update)
  const onSubmit = async (data) => {
    try {
      // Nettoyage des données (remorqueId vide = null)
      const payload = {
        ...data,
        remorqueId: data.remorqueId || null,
      };

      if (editingId) {
        await updateTrajet(editingId, payload);
        toast.success("Trajet modifié !");
      } else {
        await createTrajet(payload);
        toast.success("Trajet créé !");
      }
      reset();
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur opération");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce trajet ?")) {
      try {
        await deleteTrajet(id);
        toast.success("Trajet supprimé");
        fetchData();
      } catch (error) {
        toast.error("Erreur suppression");
      }
    }
  };

  const getStatutBadge = (statut) => {
    const colors = {
      a_faire: { bg: "#e2e3e5", text: "#383d41" },
      en_cours: { bg: "#cce5ff", text: "#004085" },
      termine: { bg: "#d4edda", text: "#155724" },
    };
    const style = colors[statut] || colors["a_faire"];
    return (
      <span
        style={{
          backgroundColor: style.bg,
          color: style.text,
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "0.85rem",
        }}
      >
        {statut?.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ color: "#2c3e50" }}>Historique des Trajets</h1>
        <button onClick={handleAddNew} style={styles.addButton}>
          <FaPlus /> {showForm ? "Fermer" : "Nouveau Trajet"}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginTop: 0 }}>
            {editingId ? "Modifier le trajet" : "Planifier un trajet"}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Point de départ</label>
              <input
                {...register("pointDepart")}
                placeholder="Ville de départ"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Point d'arrivée</label>
              <input
                {...register("pointArrivee")}
                placeholder="Ville d'arrivée"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Date de départ</label>
              <input
                type="date"
                {...register("dateDepart")}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Km Départ</label>
              <input
                type="number"
                {...register("kmDepart")}
                placeholder="Compteur actuel"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label>Chauffeur</label>
              <select {...register("chauffeurId")} style={styles.input} required>
                <option value="">-- Sélectionner Chauffeur --</option>
                {chauffeurs.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.prenom} {c.nom}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Camion</label>
              <select {...register("camionId")} style={styles.input} required>
                <option value="">-- Sélectionner Camion --</option>
                {camions.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.matricule} - {c.marque}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Remorque (Optionnel)</label>
              <select {...register("remorqueId")} style={styles.input}>
                <option value="">-- Aucune --</option>
                {remorques.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.matricule} ({r.type})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
              <label>Remarques</label>
              <input
                {...register("remarques")}
                placeholder="Notes supplémentaires..."
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.submitButton}>
              {editingId ? "Mettre à jour" : "Enregistrer"}
            </button>
          </form>
        </div>
      )}

      {/* Tableau */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: "#ecf0f1" }}>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Itinéraire</th>
              <th style={styles.th}>Chauffeur</th>
              <th style={styles.th}>Véhicule</th>
              <th style={styles.th}>Statut</th>
              <th style={styles.th}>Distance</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trajets.map((t) => (
              <tr key={t._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={styles.td}>
                  {new Date(t.dateDepart).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <FaMapMarkerAlt color="#e74c3c" /> {t.pointDepart} ➝{" "}
                    {t.pointArrivee}
                  </div>
                </td>
                <td style={styles.td}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <FaUser color="#7f8c8d" /> {t.chauffeurId?.prenom}{" "}
                    {t.chauffeurId?.nom}
                  </div>
                </td>
                <td style={styles.td}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <FaTruck color="#3498db" /> {t.camionId?.matricule}
                  </div>
                </td>
                <td style={styles.td}>{getStatutBadge(t.statut)}</td>
                <td style={styles.td}>
                  {t.distanceParcourue > 0 ? `${t.distanceParcourue} km` : "-"}
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(t)}
                    style={styles.editButton}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
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
  );
};

const styles = {
  addButton: {
    backgroundColor: "#3498db",
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
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "5px" },
  submitButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    gridColumn: "1 / -1",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "15px", textAlign: "left", color: "#7f8c8d" },
  td: { padding: "15px", color: "#2c3e50" },
  editButton: {
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Trajets;
