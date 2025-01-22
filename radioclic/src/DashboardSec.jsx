import React, { useState, useEffect } from "react";
import axios from "axios";
import './DashboardSec.css';
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faHouse, faUser, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate} from "react-router-dom";
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import { faCoins } from '@fortawesome/free-solid-svg-icons'


function DashboardSec() {
    const navigate = useNavigate();
    const[nbreDeRendezVous, setNbreDeRendezVous]= useState(0);
    const[nbreDePatients, setNbreDePatients]= useState(0);
    const [totalDeFrais,setTotalDeFrais]= useState(0);
    const [appointments, setAppointments] = useState([]);
    const [patient, setPatient] = useState({});
    const [showSidebar, setShowSidebar] = useState(true);
    const [user, setUser] = useState({});
    const [showProfileInfo, setShowProfileInfo] = useState(false);
    const [appointmentStatuses, setAppointmentStatuses] = useState({});

    const handleProfileClick = () => {
      setShowProfileInfo(!showProfileInfo);
    };

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:5000/api/user/compte-info', {
              headers: { Authorization: `Bearer ${token}` }
            }); 
            setUser(response.data.user);
          } catch (error) {
            console.error('Erreur lors de la récupération du utilisateur:', error);
          }
        };
    
        fetchUser();
      }, []);
  

    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar); // Inverse l'état actuel du sidebar
    };

    const handleAddFacture = (patientId) => {
        navigate(`/ajouterFacture/${patientId}`);
      };

      const handleConsulterFactures = (patientId) => {
        navigate(`/listeFacture/${patientId}`);
      };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem("token");
            const appointmentsResponse = await fetch(`http://localhost:5000/api/rendez-vous/rendezvous-secretaire`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const patientsResponse = await fetch(`http://localhost:5000/api/rendez-vous/rendezvous-patient-secretaire`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const appointmentsData = await appointmentsResponse.json();
            const patientsData = await patientsResponse.json();
            
            setAppointments(appointmentsData);
            setPatient(patientsData);

            const statuses = {};
            for (const appointment of appointmentsData) {
                const statusResponse = await axios.get(`http://localhost:5000/api/rendez-vous/check-radiologie/${appointment._id}`);
                statuses[appointment._id] = statusResponse.data.exists;
            }
            setAppointmentStatuses(statuses);

          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        
        fetchData();
      }, []);

    useEffect(() => {
      const fetchNumberOfAppointments = async () => {
          try {
              const response = await axios.get("http://localhost:5000/api/statistique/rendez-vous-secretaire/count");
              if (response.data.success) {
                  setNbreDeRendezVous(response.data.count);
              } else {
                  console.error(response.data.message);
              }
          } catch (error) {
              console.error("Error fetching number of appointments:", error);
          }
      };
  
      fetchNumberOfAppointments();
  }, []);

  useEffect(() => {
    const fetchNumberOfPatients = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/statistique/patients/count");
            if (response.data.success) {
                setNbreDePatients(response.data.count);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching number of patients:", error);
        }
    };

    fetchNumberOfPatients();
}, []);

useEffect(() => {
  const fetchTotalDesFrais = async () => {
      try {
          const response = await axios.get("http://localhost:5000/api/statistique/factures-secretaire/sum");
          if (response.data.success) {
              setTotalDeFrais(response.data.sum);
          } else {
              console.error(response.data.message);
          }
      } catch (error) {
          console.error("Error fetching total of money:", error);
      }
  };

  fetchTotalDesFrais();
}, []);

const handleLogout = () => {
  localStorage.removeItem("token");
  // Rediriger vers la page de connexion ou une autre page appropriée
  navigate("/login");
};

return (
  <div>
      <section id="sidebar" className={showSidebar ? "show" : "hide"}>
          <a href="#" className="brand">
              <i className='bx bxs-smile'></i>
              <span className="text">RadioClic</span>
          </a>
          <ul className="side-menu top">
              <li className="active">
                  <a href="/dashboardSec">
                      <i className='bx bxs-dashboard'><FontAwesomeIcon icon={faHouse} /></i>
                      <span className="text">Tableau de bord</span>
                  </a>
              </li>
              <li>
<a href="/listePatientSec">
 <i className='bx bxs-message-dots' ><FontAwesomeIcon  icon={faCalendarCheck}/></i>
 <span className="text">Gestion des patients</span>
</a>
</li>
              <li>
                  <a href="/compteSec">
                      <i className='bx bxs-shopping-bag-alt'><FontAwesomeIcon icon={faUser} /></i>
                      <span className="text">Mon compte</span>
                  </a>
              </li>
          </ul>

      </section>
      <section id="content" className={showSidebar ? "expanded" : "collapsed"}>
      <nav>
<i className='bx bx-menu' onClick={handleToggleSidebar}><FontAwesomeIcon icon={faBars} /></i>
<h6 className='profile-name'>{user.nom} {user.prenom}</h6>
<div className="position">
          <div className={`toggle ${showProfileInfo ? 'active' : ''}`} onClick={handleProfileClick}>
  <FontAwesomeIcon className="icon" icon={showProfileInfo ? faTimes : faUser} />
</div>
{showProfileInfo && (
  <div className="profile-infotoggle">
    <img src={User} alt="Profile Picture" />
    <div className="icon-text">
      <FontAwesomeIcon icon={faUser} />
      <h5 className="username"> {user.nom} {user.prenom}</h5>
    </div>
    <div className="icon-text">
      <FontAwesomeIcon icon={faEnvelope} />
      <p className="email"> {user.email}</p>
    </div>
    <div className="icon-text">
      <FontAwesomeIcon icon={faPhone} />
      <p className="phone"> {user.telephone}</p>
    </div>
  </div>
)}


<a href="#!" onClick={handleLogout} className="deconnecter">
        <FontAwesomeIcon className="icons" icon={faRightFromBracket} />
      </a>
      </div>
        </nav>
          <main>
          <h2 className="salut"><FontAwesomeIcon icon={faHouse}/> Bienvenue </h2>

<div>
<ul className="box-info">
<li>
 <i className='bx bxs-calendar-check' ><FontAwesomeIcon icon={faUser}/></i>
 <span className="text">
   <h3>{nbreDePatients}</h3>
   <p>Nombre de patients</p>
 </span>
</li>
<li>
 <i className='bx bxs-group' ><FontAwesomeIcon icon={faCalendarCheck}/></i>
 <span className="text">
   <h3>{nbreDeRendezVous}</h3>
   <p>Nombre des rendez vous</p>
 </span>
</li>
<li>
 <i className='bx bxs-dollar-circle' ><FontAwesomeIcon icon={faCoins} /></i>
 <span className="text">
   <h3>{totalDeFrais} dt</h3>
   <p>Revenus</p>
 </span>
</li>
</ul>
</div>
          <div className="list-container">
              <div className="ajouter-section">
                  <h2 className="gestion-title">Liste des rendez vous</h2>
              </div>
              
              <div className="list-facture">
                  <table className="facture-table">
                      <thead>
                          <tr>
                              <th>Nom complet</th>
                              <th>Téléphone</th>
                              <th>Heure de rendez vous</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                       {patient[appointments.indexOf(appointment)] && (
                      <>
                       <td>
                       {patient[appointments.indexOf(appointment)].nom} {patient[appointments.indexOf(appointment)].prenom}
                           {appointmentStatuses[appointment._id] ? (
                              <FontAwesomeIcon icon={faCheckCircle} className="completed-icon" />
                            ) : null}
                      </td>
                      <td>{patient[appointments.indexOf(appointment)].telephone}</td> 
                      </>
                    )}
                    <td>{appointment.heure}</td>
                    <td>
                     <button className="modifier-facture-btn" title="accéder à la liste des factures" onClick={() => handleConsulterFactures(patient[appointments.indexOf(appointment)]._id)}>
                        <FontAwesomeIcon icon={faList} />
                    </button>
                    <button className="supprimer-facture-btn" title="ajouter une nouvelle facture" onClick={() => handleAddFacture(patient[appointments.indexOf(appointment)]._id)}>
                      <FontAwesomeIcon icon={faFileCirclePlus} />
                    </button>
                   </td>
                   </tr>
))}
                  </tbody>
                  </table>
              </div>
              
          </div>
          </main>
      </section>
  </div>
);
}

export default DashboardSec;