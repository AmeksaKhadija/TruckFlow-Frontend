import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getAllRemorques,
  createRemorque,
  updateRemorque,
  deleteRemorque,
} from "../../services/remorqueService";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";

const Remorques = () => {
  const [remorques, setRemorques] = useState([]);
  // ✅ On récupère setValue
  const { register, handleSubmit, reset, setValue } = useForm();
  const [showForm, setShowForm] = useState(false);
  // ✅ État pour l'édition
  const [editingId, setEditingId] = useState(null);

  // Charger les données
  const fetchRemorques = async () => {
    try {
      const res = await getAllRemorques();
      setRemorques(res.data);
    } catch (error) {
      toast.error("Erreur chargement remorques");
    }
  };

  useEffect(() => {
    fetchRemorques();
  }, []);

  // ✅ Fonction pour pré-remplir le formulaire (Mode Édition)
  const handleEdit = (remorque) => {
    setEditingId(remorque._id);
    setValue("matricule", remorque.matricule);
    setValue("marque", remorque.marque);
    setValue("modele", remorque.modele);
    setValue("type", remorque.type);
    setValue("capaciteCharge", remorque.capaciteCharge);
    setValue("anneeFabrication", remorque.anneeFabrication);
    setShowForm(true);
  };

  // ✅ Fonction pour réinitialiser (Nouvelle Remorque)
  const handleAddNew = () => {
    setEditingId(null);
    reset();
    setShowForm(!showForm);
  };

  // ✅ Gestion Création OU Modification
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await updateRemorque(editingId, data);
        toast.success("Remorque modifiée !");
      } else {
        await createRemorque(data);
        toast.success("Remorque ajoutée !");
      }
      reset();
      setEditingId(null);
      setShowForm(false);
      fetchRemorques();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur opération");
    }
  };

  // Supprimer une remorque
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette remorque ?")) {
      try {
        await deleteRemorque(id);
        toast.success("Remorque supprimée");
        fetchRemorques();
      } catch (error) {
        toast.error("Erreur suppression");
      }
    }
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
        <h1 style={{ color: "#2c3e50" }}>Gestion des Remorques</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          <FaPlus /> {showForm ? "Fermer" : "Nouvelle Remorque"}
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div style={styles.formCard}>
          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <input
              {...register("matricule")}
              placeholder="Matricule (ex: AA-123-BB)"
              style={styles.input}
              required
            />
            <input
              {...register("marque")}
              placeholder="Marque"
              style={styles.input}
              required
            />
            <input
              {...register("modele")}
              placeholder="Modèle"
              style={styles.input}
              required
            />
            <select {...register("type")} style={styles.input}>
              <option value="fourgon">Fourgon</option>
              <option value="plateau">Plateau</option>
              <option value="frigo">Frigo</option>
            </select>
            <input
              type="number"
              {...register("capaciteCharge")}
              placeholder="Capacité (kg)"
              style={styles.input}
              required
            />
            <input
              type="number"
              {...register("anneeFabrication")}
              placeholder="Année"
              style={styles.input}
              required
            />
            <button type="submit" style={styles.submitButton}>
              Enregistrer
            </button>
          </form>
        </div>
      )}

      {/* Tableau */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: "#ecf0f1" }}>
              <th style={styles.th}>Matricule</th>
              <th style={styles.th}>Marque/Modèle</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>État</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {remorques.map((r) => (
              <tr key={r._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={styles.td}>{r.matricule}</td>
                <td style={styles.td}>
                  {r.marque} {r.modele}
                </td>
                <td style={styles.td}>{r.type}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: r.estActif ? "#d4edda" : "#f8d7da",
                      color: r.estActif ? "#155724" : "#721c24",
                    }}
                  >
                    {r.estActif ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td style={styles.td}>
                  {/* ✅ Bouton Éditer */}
                  <button
                    onClick={() => handleEdit(r)}
                    style={styles.editButton}
                  >
                    <FaEdit />
                  </button>
                  {/* Bouton Supprimer */}
                  <button
                    onClick={() => handleDelete(r._id)}
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
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
  },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "5px" },
  submitButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
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
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  editButton: {
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },
};

export default Remorques;
