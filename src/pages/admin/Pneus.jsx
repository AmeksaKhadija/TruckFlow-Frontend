import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getAllPneus,
  createPneu,
  updatePneu,
  deletePneu,
} from "../../services/pneuService";
import { getAllCamions } from "../../services/camionService";
import { getAllRemorques } from "../../services/remorqueService";
import { toast } from "react-toastify";
// ✅ Correction : Ajout de FaPlus dans les imports
import { FaTrash, FaPlus, FaEdit, FaCircle } from "react-icons/fa";

const Pneus = () => {
  const [pneus, setPneus] = useState([]);
  const [camions, setCamions] = useState([]);
  const [remorques, setRemorques] = useState([]);

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const selectedType = watch("typeVehicule");

  const fetchData = async () => {
    try {
      const [pneusRes, camionsRes, remorquesRes] = await Promise.all([
        getAllPneus(),
        getAllCamions(),
        getAllRemorques(),
      ]);
      setPneus(pneusRes.data);
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

  const handleEdit = (pneu) => {
    setEditingId(pneu._id);
    setValue("reference", pneu.reference);
    setValue("marque", pneu.marque);
    setValue("dimension", pneu.dimension);
    setValue("typeVehicule", pneu.typeVehicule);
    setValue("vehiculeId", pneu.vehiculeId?._id || pneu.vehiculeId);
    setValue("position", pneu.position);
    setValue("usurePourcentage", pneu.usurePourcentage);
    setValue("kilometrageInstallation", pneu.kilometrageInstallation);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    reset();
    setShowForm(!showForm);
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await updatePneu(editingId, data);
        toast.success("Pneu modifié !");
      } else {
        await createPneu(data);
        toast.success("Pneu ajouté !");
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
    if (window.confirm("Supprimer ce pneu ?")) {
      try {
        await deletePneu(id);
        toast.success("Pneu supprimé");
        fetchData();
      } catch (error) {
        toast.error("Erreur suppression");
      }
    }
  };

  const getEtatColor = (etat) => {
    switch (etat) {
      case "neuf": return "#2ecc71";
      case "bon": return "#3498db";
      case "moyen": return "#f1c40f";
      case "usé": return "#e67e22";
      case "à_remplacer": return "#e74c3c";
      default: return "#95a5a6";
    }
  };

  const vehiculesDisponibles = selectedType === "Camion" ? camions : remorques;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#2c3e50" }}>Gestion des Pneus</h1>
        <button onClick={handleAddNew} style={styles.addButton}>
          <FaPlus /> {showForm ? "Fermer" : "Nouveau Pneu"}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginTop: 0 }}>{editingId ? "Modifier le pneu" : "Ajouter un pneu"}</h3>
          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <input {...register("reference")} placeholder="Référence (ex: PNEU-001)" style={styles.input} required />
            <input {...register("marque")} placeholder="Marque" style={styles.input} required />
            <input {...register("dimension")} placeholder="Dimension" style={styles.input} required />

            <select {...register("typeVehicule")} style={styles.input} required>
              <option value="">-- Type de Véhicule --</option>
              <option value="Camion">Camion</option>
              <option value="Remorque">Remorque</option>
            </select>

            <select {...register("vehiculeId")} style={styles.input} required>
              <option value="">-- Choisir le véhicule --</option>
              {vehiculesDisponibles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.matricule} ({v.marque})
                </option>
              ))}
            </select>

            <select {...register("position")} style={styles.input} required>
              <option value="">-- Position --</option>
              <option value="avant_gauche">Avant Gauche</option>
              <option value="avant_droit">Avant Droit</option>
              <option value="arriere_gauche">Arrière Gauche</option>
              <option value="arriere_droit">Arrière Droit</option>
              <option value="spare">Roue de secours</option>
            </select>

            <input type="number" {...register("kilometrageInstallation")} placeholder="Km à l'installation" style={styles.input} required />

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>Usure actuelle (%):</label>
              <input type="number" {...register("usurePourcentage")} defaultValue={0} min="0" max="100" style={{ ...styles.input, flex: 1 }} />
            </div>

            <button type="submit" style={styles.submitButton}>
              {editingId ? "Mettre à jour" : "Enregistrer"}
            </button>
          </form>
        </div>
      )}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: "#ecf0f1" }}>
              <th style={styles.th}>Référence</th>
              <th style={styles.th}>Marque</th>
              <th style={styles.th}>Véhicule</th>
              <th style={styles.th}>Position</th>
              <th style={styles.th}>Usure</th>
              <th style={styles.th}>État</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pneus.map((p) => (
              <tr key={p._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={styles.td}><strong>{p.reference}</strong></td>
                <td style={styles.td}>{p.marque} {p.dimension}</td>
                <td style={styles.td}>
                  {p.vehiculeId ? (
                    <span style={styles.badgeVehicule}>
                      {p.typeVehicule === "Camion" ? "🚛" : "🛒"} {p.vehiculeId.matricule}
                    </span>
                  ) : (
                    <span style={{ color: "#ccc" }}>Non monté</span>
                  )}
                </td>
                <td style={styles.td}>{p.position}</td>
                <td style={styles.td}>
                  <div style={{ width: "100px", backgroundColor: "#eee", height: "8px", borderRadius: "4px" }}>
                    <div style={{ width: `${p.usurePourcentage}%`, backgroundColor: getEtatColor(p.etat), height: "100%", borderRadius: "4px" }}></div>
                  </div>
                  <small>{p.usurePourcentage}%</small>
                </td>
                <td style={styles.td}>
                  <span style={{ color: getEtatColor(p.etat), fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
                    <FaCircle size={10} /> {p.etat?.replace("_", " ")}
                  </span>
                </td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(p)} style={styles.editButton}><FaEdit /></button>
                  <button onClick={() => handleDelete(p._id)} style={styles.deleteButton}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ✅ Correction : Ajout des styles manquants
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
    gap: "15px",
  },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "5px" },
  submitButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    gridColumn: "1 / -1"
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
 badgeVehicule: {
    backgroundColor: "#e8f4fd",
    color: "#3498db",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
};

export default Pneus;
