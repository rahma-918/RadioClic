import React, {useState, useEffect} from "react";
import axios from "axios";
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { faFileMedical } from '@fortawesome/free-solid-svg-icons'
import './RadiologiesCompletes.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";

function RadiologiesCompPatient() {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [radiologies, setRadiologies] = useState([]);
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

  useEffect(() => {
    const fetchRadiologies = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/dossier-medical/radiologies", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setRadiologies(response.data.radiologies);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching radiologies:", error);
        }
    };

    fetchRadiologies();
}, []);

  // Fonction pour afficher l'image en plein écran lorsqu'on clique dessus
  const toggleFullscreen = (image) => {
    setFullscreenImage(image);
  };

  // Fonction pour fermer l'image en plein écran
  const closeFullscreen = () => {
    setFullscreenImage(null);
  };
  return (
    <div>
      <section id="sidebar">
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
          <h2 className="titre">Liste des radiographies</h2>
          <div className="liste-radiologie">
            {radiologies.map((radiologie) => (
              <div key={radiologie._id} className="radiologie">
                <img
                  src={radiologie.imageUrl}
                  alt={`Radiologie ${radiologie._id}`}
                  onClick={() => toggleFullscreen(radiologie.imageUrl)}
                />
                <p>Date: {formatDate(radiologie.date_creation)}</p>
                <p>Type: {radiologie.type}</p>
              </div>
            ))}
          </div>
          {fullscreenImage && (
            <div className="fullscreen-image">
              <img
                id="fullscreen-img"
                src={fullscreenImage}
                alt="Fullscreen"
                style={{ width: "900px", height: "900px" }}
                onClick={closeFullscreen}
              />
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
export default RadiologiesCompPatient;