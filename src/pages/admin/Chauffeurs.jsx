import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getAllChauffeurs,
  createChauffeur,
  deleteChauffeur,
} from "../../services/chauffeurService";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaPlus,
  FaUserTie,
  FaEnvelope,
  FaIdCard,
} from "react-icons/fa";

const Chauffeurs = () => {
  const [chauffeurs, setChauffeurs] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [showForm, setShowForm] = useState(false);

  const fetchChauffeurs = async () => {
    try {
      const res = await getAllChauffeurs();
      setChauffeurs(res.data);
    } catch (error) {
      toast.error("Erreur chargement chauffeurs");
    }
  };

  useEffect(() => {
    fetchChauffeurs();
  }, []);

  const onSubmit = async (data) => {
    try {
      await createChauffeur(data);
      toast.success("Chauffeur créé avec succès !");
      reset();
      setShowForm(false);
      fetchChauffeurs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur création");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Supprimer ce chauffeur ? Cette action est irréversible.")
    ) {
      try {
        await deleteChauffeur(id);
        toast.success("Chauffeur supprimé");
        fetchChauffeurs();
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
        <h1 style={{ color: "#2c3e50" }}>Gestion des Chauffeurs</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          <FaPlus /> {showForm ? "Fermer" : "Nouveau Chauffeur"}
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginTop: 0, color: "#34495e" }}>
            Enregistrer un nouveau chauffeur
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.inputGroup}>
              <input
                {...register("prenom")}
                placeholder="Prénom"
                style={styles.input}
                required
              />
              <input
                {...register("nom")}
                placeholder="Nom"
                style={styles.input}
                required
              />
            </div>
            <input
              type="email"
              {...register("email")}
              placeholder="Email professionnel"
              style={styles.input}
              required
            />
            <input
              type="password"
              {...register("password")}
              placeholder="Mot de passe provisoire"
              style={styles.input}
              required
              minLength={6}
            />

            <button type="submit" style={styles.submitButton}>
              Créer le compte
            </button>
          </form>
        </div>
      )}

      {/* Liste des cartes Chauffeurs (Plus joli qu'un tableau pour des personnes) */}
      <div style={styles.grid}>
        {chauffeurs.map((c) => (
          <div key={c._id} style={styles.card}>
            <div style={styles.avatar}>
              {c.prenom.charAt(0)}
              {c.nom.charAt(0)}
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.name}>
                {c.prenom} {c.nom}
              </h3>
              <p style={styles.info}>
                <FaEnvelope style={{ marginRight: "5px" }} /> {c.email}
              </p>
              <p style={styles.info}>
                <FaIdCard style={{ marginRight: "5px" }} /> ID: ...
                {c._id.slice(-4)}
              </p>
              <p style={styles.date}>
                Inscrit le {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(c._id)}
              style={styles.deleteButton}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {chauffeurs.length === 0 && (
        <p style={{ textAlign: "center", color: "#7f8c8d", marginTop: "50px" }}>
          Aucun chauffeur enregistré.
        </p>
      )}
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
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "30px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    maxWidth: "600px",
    margin: "0 auto 30px auto",
  },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { display: "flex", gap: "15px" },
  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    position: "relative",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#34495e",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  cardContent: { flex: 1 },
  name: { margin: "0 0 5px 0", color: "#2c3e50" },
  info: {
    margin: "2px 0",
    color: "#7f8c8d",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
  },
  date: { margin: "10px 0 0 0", color: "#bdc3c7", fontSize: "0.8rem" },
  deleteButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "none",
    border: "none",
    color: "#e74c3c",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default Chauffeurs;
