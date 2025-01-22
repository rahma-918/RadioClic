import React, { useState, useEffect } from "react";
import axios from "axios";
import './PriseRendezVous.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { faFileMedical } from '@fortawesome/free-solid-svg-icons'
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom";

function PriseRendezVous(){
  const [creneauxDisponibles, setCreneauxDisponibles] = useState([]);
  const [typeRadiologie, setTypeRadiologie] = useState("");
  const [searched, setSearched] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [user, setUser] = useState({});
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Rediriger vers la page de connexion ou une autre page appropriée
    navigate("/login");
  }; 

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

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rendez-vous/creneaux-disponibles/${typeRadiologie}`);
      setCreneauxDisponibles(response.data);
      setSearched(true);
    } catch (error) {
      console.log(error);
    }
  };



  const handleChooseSlot = (creneau) => {
    // Popup de confirmation
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir réserver ce créneau ?");
    if (isConfirmed) {
      reserveSlot(creneau);
    }
    
  };

  const reserveSlot = async (creneau) => {
    try {
      const token = localStorage.getItem("token"); // Récupérer le token JWT du localStorage
      const config = {
        headers: {
          "Authorization": `Bearer ${token}` // Ajouter le token JWT à l'en-tête de la requête
        }
      };
      const response = await axios.put(`http://localhost:5000/api/rendez-vous/creneau-reserve/${creneau._id}`, null, config); // Envoyer la requête avec le token
      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Quelque chose s'est mal passé");
    }
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
   <li className="active">
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
 <section className="welcome">
    <h1>Prenez rendez-vous</h1>
    <p>Bienvenue dans notre système de prise de rendez-vous en ligne. Nous sommes là pour vous faciliter l'accès aux soins dont vous avez besoin.</p>
  </section>
  <section id="search-container">
  <section id="search">
        <h2>Recherche de disponibilité :</h2>
        <form onSubmit={(e) => {
                     e.preventDefault();
                     handleSearch();
                    }}>
          <label htmlFor="typeRadiologie">Type d'examen :</label>
          <select name="typeRadiologie" id="typeRadiologie" value={typeRadiologie} onChange={(e) => setTypeRadiologie(e.target.value)}>
            <option>Select...</option>
            <option value="IRM" defaultValue>IRM</option>
            <option value="Scanner">Scanner</option>
            <option value="Radiologie">Radiologie</option>
          </select>
          <br />
          <button type="submit">Rechercher disponibilités</button>
        </form>
      </section>
    <section id="results">
        <h2>Résultats de la recherche :</h2>
        <div id="availability">
        <h3>Créneaux disponibles :</h3>
        {searched && creneauxDisponibles.length === 0 ? (
  <p className="msg">Aucun créneau disponible pour ce type d'examen.</p>
) : (
  <ul>
    {creneauxDisponibles.map((creneau) => (
      <li key={creneau._id}>
        <span>Date :</span> {formatDate(creneau.date)}<br />
        <span>Heure :</span> {creneau.heure}<br />
        <button onClick={() => handleChooseSlot(creneau)}>Choisir ce créneau</button>
      </li>
    ))}
  </ul>
)}
        </div>
    </section>
</section>

            </main>
      </section>
    </div>
        
    );
}

export default PriseRendezVous;