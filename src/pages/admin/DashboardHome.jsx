import { useState, useEffect } from 'react';
import { FaTruck, FaExclamationTriangle, FaRoute, FaGasPump, FaSpinner } from 'react-icons/fa';
import { getAllCamions } from '../../services/camionService';
import { getGlobalStats } from '../../services/trajetService';
import { getMaintenanceAlerts } from '../../services/maintenanceService';
import { toast } from 'react-toastify';

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState({
    camionsActifs: 0,
    trajetsTotal: 0,
    alertesMaintenance: 0,
    consoMoyenne: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Lancer tous les appels API en parallèle pour la rapidité
        const [camionsRes, statsTrajetsRes, maintenanceRes] = await Promise.all([
          getAllCamions(),       // Pour compter les camions actifs
          getGlobalStats(),      // Pour la conso et le nb de trajets
          getMaintenanceAlerts() // Pour le nb d'alertes
        ]);

        // 2. Calculer les KPIs
        
        // Camions : on compte ceux qui ont estActif = true
        const activeTrucks = camionsRes.data ? camionsRes.data.filter(c => c.estActif).length : 0;

        // Trajets : données globales du backend
        const globalStats = statsTrajetsRes.data?.global || {};
        
        // Maintenance : nombre d'alertes retournées
        const alertesCount = maintenanceRes.data ? maintenanceRes.data.length : 0;

        // 3. Mettre à jour l'état
        setKpi({
          camionsActifs: activeTrucks,
          trajetsTotal: globalStats.totalTrajets || 0,
          alertesMaintenance: alertesCount,
          consoMoyenne: globalStats.consommationMoyenne ? globalStats.consommationMoyenne.toFixed(1) : 0
        });

      } catch (error) {
        console.error("Erreur Dashboard:", error);
        toast.error("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Configuration des cartes avec les vraies données
  const statsCards = [
    { 
      title: 'Camions Actifs', 
      value: kpi.camionsActifs, 
      icon: <FaTruck />, 
      color: '#3498db',
      unit: '' 
    },
    { 
      title: 'Trajets Réalisés', 
      value: kpi.trajetsTotal, 
      icon: <FaRoute />, 
      color: '#2ecc71',
      unit: '' 
    },
    { 
      title: 'Alertes Maintenance', 
      value: kpi.alertesMaintenance, 
      icon: <FaExclamationTriangle />, 
      color: kpi.alertesMaintenance > 0 ? '#e74c3c' : '#95a5a6', // Rouge si alertes, Gris sinon
      unit: '' 
    },
    { 
      title: 'Conso Moyenne', 
      value: kpi.consoMoyenne, 
      icon: <FaGasPump />, 
      color: '#f39c12',
      unit: 'L/100km' 
    },
  ];

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#7f8c8d'}}>
        <FaSpinner className="icon-spin" size={40} />
        <span style={{marginLeft: '10px'}}>Chargement des données...</span>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{marginBottom: '20px', color: '#2c3e50'}}>Vue d'ensemble</h1>
      
      {/* Grille de statistiques */}
      <div style={styles.grid}>
        {statsCards.map((stat, index) => (
          <div key={index} style={styles.card}>
            <div style={{...styles.iconContainer, backgroundColor: stat.color}}>
              {stat.icon}
            </div>
            <div>
              <p style={styles.cardTitle}>{stat.title}</p>
              <h3 style={styles.cardValue}>
                {stat.value} <small style={{fontSize: '0.6em', color: '#95a5a6'}}>{stat.unit}</small>
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'transform 0.2s',
    cursor: 'default'
  },
  iconContainer: {
    width: '50px',
    height: '50px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.5rem',
  },
  cardTitle: {
    margin: 0,
    color: '#7f8c8d',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  cardValue: {
    margin: '5px 0 0 0',
    color: '#2c3e50',
    fontSize: '1.8rem',
    fontWeight: 'bold'
  },
  section: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#2c3e50',
    fontSize: '1.2rem',
  },
  infoBox: {
      padding: '10px 20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px',
      border: '1px solid #e9ecef',
      color: '#495057'
  }
};

export default DashboardHome;