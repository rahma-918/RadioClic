import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./DossierMédicalPatient.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { faFileMedical, faDownload } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";


function DossierMédicalPatient() {

    const [radiologies, setRadiologies] = useState([]);
    const [medicalReports, setMedicalReports] = useState([]);
    const [patientInfo, setPatientInfo] = useState({});
    const [dossierMedicalInfo, setDossierMedicalInfo] = useState({});
    const [factures, setFactures] = useState([]);
    const [showSidebar, setShowSidebar] = useState(true);
    const [user, setUser] = useState({});
    const [showProfileInfo, setShowProfileInfo] = useState(false);
    const navigate= useNavigate();

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

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      // Use Date methods to get year, month, and day
      const year = date.getFullYear();
      // Month is zero-based, so add 1 to get the correct month
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      // Return formatted date string
      return `${year}-${month}-${day}`;
    };

    const handleDownloadReport = async (reportId) => {
      try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://localhost:5000/api/dossier-medical/rapports/${reportId}/telecharger`, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob', // Important: Indiquer que la réponse est de type blob (fichier)
          });
          
          toast.success("rapport téléchargé avec succés");
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `rapport_medical_${reportId}.pdf`);
          document.body.appendChild(link);
          link.click();
          
      } catch (error) {
          toast.error("Erreur lors du téléchargement du rapport médical :", error);
      }
  };

    useEffect(() => {
      const fetchPatientInfo = async () => {
          try {
              const token = localStorage.getItem("token");
              const response = await axios.get("http://localhost:5000/api/dossier-medical/patient-info", {
                  headers: { Authorization: `Bearer ${token}` }
              });
              if (response.data.success) {
                  setPatientInfo(response.data.patientInfo);
                  setDossierMedicalInfo(response.data.dossierMedicalInfo);
              } else {
                  console.error(response.data.message);
              }
          } catch (error) {
              console.error("Error fetching patient information:", error);
          }
      };
  
      fetchPatientInfo();
  }, []);
  
   
    useEffect(() => {
      const fetchRadiologies = async () => {
          try {
              const token = localStorage.getItem("token");
              const response = await axios.get("http://localhost:5000/api/dossier-medical/radiologies", {
                  headers: { Authorization: `Bearer ${token}` }
              });
              if (response.data.success) {
                // Tri des radiologies par date de création
                const sortedRadiologies = response.data.radiologies.sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation));
                // Limiter le nombre de radiologies à 3
                const recentRadiologies = sortedRadiologies.slice(0, 3);
                setRadiologies(recentRadiologies);
            } else {
                console.error(response.data.message);
            }
          } catch (error) {
              console.error("Error fetching radiologies:", error);
          }
      };
  
      fetchRadiologies();
  }, []);

  useEffect(() => {
    const fetchFactures = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/dossier-medical/factures", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setFactures(response.data.factures);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching factures:", error);
        }
    };

    fetchFactures();
}, []);



    useEffect(() => {
      const fetchMedicalReports = async () => {
          try {
              const token = localStorage.getItem("token");
              const response = await axios.get("http://localhost:5000/api/dossier-medical/medical-reports", {
                  headers: { Authorization: `Bearer ${token}` }
              });
              if (response.data.success) {
                  setMedicalReports(response.data.medicalReports);
              } else {
                  console.error(response.data.message);
              }
          } catch (error) {
              console.error("Error fetching medical reports:", error);
          }
      };
  
      fetchMedicalReports();
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
          <li>
            <a href="/homepatient">
              <i className='bx bxs-dashboard' ><FontAwesomeIcon icon={faHouse}/></i>
              <span className="text">Tableau de bord</span>
            </a>
          </li>
          <li>
            <a href="/comptepatient">
              <i className='bx bxs-shopping-bag-alt' ><FontAwesomeIcon icon={faUser}/></i>
              <span className="text">Mon compte</span>
            </a>
          </li>
          <li>
            <a href="/priseRDV">
              <i className='bx bxs-doughnut-chart' ><FontAwesomeIcon  icon={faCalendar}/></i>
              <span className="text">Prise de rendez vous</span>
            </a>
          </li>
          <li className="active">
            <a href="/dossierMedical">
              <i className='bx bxs-message-dots' ><FontAwesomeIcon  icon={faFolder}/></i>
              <span className="text">Dossier Médicale</span>
            </a>
          </li>
          <li>
            <a href="/historique">
              <i className='bx bxs-group' ><FontAwesomeIcon icon={faFileMedical}/></i>
              <span className="text">Historique des rendez vous</span>
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
        <section id="profil">
                        <h2>Profil du patient</h2>
                        <div>
                            <p><strong>Nom :</strong> {patientInfo.nom}</p>
                            <p><strong>Prenom :</strong> {patientInfo.prenom}</p>
                            <p><strong>Date de naissance :</strong> {formatDate(patientInfo.datedenaissance)}</p>
                            <p><strong>Numéro de sécurité sociale :</strong> {dossierMedicalInfo.code_sécurité_sociale}</p>
                            <p><strong>Sexe :</strong> {patientInfo.sexe}</p>
                            <p><strong>Téléphone :</strong> {patientInfo.telephone}</p>
                            <p><strong>E-mail :</strong> {patientInfo.email}</p>
                        </div>
                    </section>
          <section id="radiologies">
                <h2>Radiographies</h2>
                <div className="cadre-images">
                  <div className="liste-radiologie">
                  {radiologies.map(radiologie => (
                    <div className="radiologie">
                        <img 
                            key={radiologie._id}
                            src={radiologie.imageUrl}
                            alt={`Radiographie ${radiologie.type}`}
                            title={`Date: ${formatDate(radiologie.date_creation)}, Type: ${radiologie.type}`}
                            style={{ width: "250px", height: "250px" }}
                        />
                        <p>Date: {formatDate(radiologie.date_creation)}</p>
                        <p>Type: {radiologie.type}</p>

                        </div>
                    ))}
                  </div>
                </div>
                <Link to="/radiologiesCompPatient">Voir la liste des radiographies</Link>
            </section>

<section id="rapports-medicaux">
                <h2>Rapport Radiologique</h2>
    <div className="cadre-rapports">
    {medicalReports.map((report) => (
            <div className="rapport-item" key={report._id}>
                <p><strong>Date de création :</strong> {new Date(report.date_creation).toLocaleDateString()}</p>
                <p><strong>Contenu :</strong> {report.contenu}</p>
                <button className="telecharger" title="télécharger le rapport pdf" onClick={() => handleDownloadReport(report._id)}><FontAwesomeIcon icon={faDownload}/> Télécharger rapport</button>
            </div>
            
        ))}
         
    </div>
            </section>
          <section id="factures">
            <h2>Factures</h2>
            <div className="cadre-factures">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Examen</th>
                  </tr>
                </thead>
                <tbody>
                  {factures.map((facture) => (
                    <tr key={facture._id}>
                      <td>{formatDate(facture.date_facture)}</td>
                      <td>{facture.montant} dt</td>
                      <td>{facture.typederadiologie}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}

export default DossierMédicalPatient;