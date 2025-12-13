import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getAllCamions,
  createCamion,
  updateCamion,
  deleteCamion,
} from "../../services/camionService";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaTruck, FaEdit } from "react-icons/fa";

const Camions = () => {
  const [camions, setCamions] = useState([]);
  // ✅ On récupère setValue pour pré-remplir le formulaire
  const { register, handleSubmit, reset, setValue } = useForm();
  const [showForm, setShowForm] = useState(false);
  // ✅ État pour savoir si on modifie
  const [editingId, setEditingId] = useState(null);

  const fetchCamions = async () => {
    try {
      const res = await getAllCamions();
      setCamions(res.data);
    } catch (error) {
      toast.error("Erreur chargement camions");
    }
  };

  useEffect(() => {
    fetchCamions();
  }, []);

  // ✅ Fonction pour pré-remplir le formulaire (Mode Édition)
  const handleEdit = (camion) => {
    setEditingId(camion._id);
    setValue("matricule", camion.matricule);
    setValue("marque", camion.marque);
    setValue("modele", camion.modele);
    setValue("capaciteCharge", camion.capaciteCharge);
    setValue("anneeFabrication", camion.anneeFabrication);
    setValue("kilometrage", camion.kilometrage);
    setShowForm(true);
  };

  // ✅ Fonction pour réinitialiser le formulaire (Nouveau Camion)
  const handleAddNew = () => {
    setEditingId(null);
    reset();
    setShowForm(!showForm);
  };

  // ✅ Gestion Création OU Modification (Une seule fonction)
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await updateCamion(editingId, data);
        toast.success("Camion modifié !");
      } else {
        await createCamion(data);
        toast.success("Camion ajouté !");
      }
      reset();
      setEditingId(null);
      setShowForm(false);
      fetchCamions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur opération");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce camion ?")) {
      try {
        await deleteCamion(id);
        toast.success("Camion supprimé");
        fetchCamions();
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
        <h1 style={{ color: "#2c3e50" }}>Gestion de la Flotte</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          <FaPlus /> {showForm ? "Fermer" : "Nouveau Camion"}
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
            <input
              type="number"
              {...register("kilometrage")}
              placeholder="Kilométrage actuel"
              style={styles.input}
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
              <th style={styles.th}>Véhicule</th>
              <th style={styles.th}>Kilométrage</th>
              <th style={styles.th}>État Pneus</th>
              <th style={styles.th}>Statut</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {camions.map((c) => (
              <tr key={c._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={styles.td}>
                  <strong>{c.matricule}</strong>
                </td>
                <td style={styles.td}>
                  <FaTruck color="#3498db" /> {c.marque} {c.modele}
                </td>
                <td style={styles.td}>{c.kilometrage.toLocaleString()} km</td>
                <td style={styles.td}>{c.etatPneu}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: c.estActif ? "#d4edda" : "#f8d7da",
                      color: c.estActif ? "#155724" : "#721c24",
                    }}
                  >
                    {c.estActif ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td style={styles.td}>
                  {/* ✅ Bouton Éditer (Orange) */}
                  <button
                    onClick={() => handleEdit(c)}
                    style={styles.editButton}
                  >
                    <FaEdit />
                  </button>
                  {/* Bouton Supprimer (Rouge) */}
                  <button
                    onClick={() => handleDelete(c._id)}
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

export default Camions;
