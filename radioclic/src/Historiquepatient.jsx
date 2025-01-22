import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Historiquepatient.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { faFileMedical } from '@fortawesome/free-solid-svg-icons'
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons'

function HistoriquePatient() {
  const [rendezVous, setRendezVous] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [user, setUser] = useState({});
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchRendezVous = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/historique/historique-patient", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setRendezVous(response.data.rendezVous);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching historique:", error);
        }
    };

    fetchRendezVous();
}, []);

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
   <li>
     <a href="/dossierMedical">
       <i className='bx bxs-message-dots' ><FontAwesomeIcon  icon={faFolder}/></i>
       <span className="text">Dossier Médicale</span>
     </a>
   </li>
   <li className="active">
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
      <h2>Historique des rendez-vous</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Type d'examen</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {rendezVous.map((rdv) => (
              <tr key={rdv._id}>
                <td>{formatDate(rdv.date)}</td>
                <td>{rdv.heure}</td>
                <td>{rdv.typeRadiologie}</td>
                <td>Accompli < FontAwesomeIcon icon={faSquareCheck} className="check"/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      </section>
    </div>
  );
}

export default HistoriquePatient;
