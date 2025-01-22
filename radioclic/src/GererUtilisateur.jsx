import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './GererUtilisateur.css'; // Import du fichier CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faHospitalUser } from '@fortawesome/free-solid-svg-icons'
import { faUserNurse } from '@fortawesome/free-solid-svg-icons'
import { faHandSpock } from '@fortawesome/free-solid-svg-icons'
import { faUserDoctor } from '@fortawesome/free-solid-svg-icons'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { useNavigate} from "react-router-dom";

function GererUtilisateur() {
  const handleModifyClick = (userEmail) => {
    navigate(`/modifierUtilisateur/${userEmail}`);
  };
 const navigate = useNavigate();
 const [nbreRadiologues, setNbreRadiologues]= useState(0);
 const [nbreTechniciens, setNbreTechniciens]= useState(0);
 const [nbreSecretaires, setNbreSecretaires]= useState(0);
 const [techniciens, setTechniciens]= useState([]);
 const [secretaires, setSecretaires]= useState([]);
 const [radiologues, setRadiologues]= useState([]);

 const [showSidebar, setShowSidebar] = useState(true);
 const [user, setUser] = useState({});
 const [showProfileInfo, setShowProfileInfo] = useState(false);

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

 const handleLogout = () => {
  localStorage.removeItem("token");
  // Rediriger vers la page de connexion ou une autre page appropriée
  navigate("/login");
};

 const fetchSecretaires = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/userList/secretaires');
    setUtilisateurs(response.data.secretaires);
  } catch (error) {
    console.error('Erreur lors de la récupération des secrétaires:', error);
  }
};

const fetchRadiologues = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/userList/radiologues');
    setUtilisateurs(response.data.radiologues);
  } catch (error) {
    console.error('Erreur lors de la récupération des radiologues:', error);
  }
};

const fetchTechniciens = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/userList/techniciens');
    setUtilisateurs(response.data.techniciens);
  } catch (error) {
    console.error('Erreur lors de la récupération des techniciens:', error);
  }
};

 useEffect(() => {
  const fetchNumberOfRadiologues = async () => {
      try {
          const response = await axios.get("http://localhost:5000/api/statistique/radiologues/count");
          if (response.data.success) {
              setNbreRadiologues(response.data.count);
          } else {
              console.error(response.data.message);
          }
      } catch (error) {
          console.error("Error fetching number of radiologues:", error);
      }
  };

  fetchNumberOfRadiologues ();
}, []);

useEffect(() => {
  const fetchNumberOfTechniciens = async () => {
      try {
          const response = await axios.get("http://localhost:5000/api/statistique/techniciens/count");
          if (response.data.success) {
              setNbreTechniciens(response.data.count);
          } else {
              console.error(response.data.message);
          }
      } catch (error) {
          console.error("Error fetching number of techniciens:", error);
      }
  };

  fetchNumberOfTechniciens ();
}, []);

useEffect(() => {
  const fetchNumberOfSecretaires = async () => {
      try {
          const response = await axios.get("http://localhost:5000/api/statistique/secretaires/count");
          if (response.data.success) {
              setNbreSecretaires(response.data.count);
          } else {
              console.error(response.data.message);
          }
      } catch (error) {
          console.error("Error fetching number of secretaires:", error);
      }
  };

  fetchNumberOfSecretaires ();
}, []);


  

  const [utilisateurs, setUtilisateurs] = useState([]);
  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/userList/users'); 
        const filteredUtilisateurs = response.data.utilisateurs.filter(utilisateur => utilisateur.typedecompte !== 'Admin' && utilisateur.typedecompte !== 'Patient');
        setUtilisateurs(filteredUtilisateurs);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };

    fetchUtilisateurs();
  }, []);

  

  const supprimerUtilisateur = async (id) => {
    try {
      // Afficher une popup de confirmation
      const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
  
      if (confirmation) {
        // Si l'utilisateur confirme la suppression, alors supprimer l'utilisateur
        await axios.delete(`http://localhost:5000/api/userList/deleteUsers/${id}`);
        // Mettre à jour la liste des utilisateurs après la suppression
        const updatedUtilisateurs = utilisateurs.filter((utilisateur) => utilisateur._id !== id);
        setUtilisateurs(updatedUtilisateurs);
        toast.success("Utilisateur supprimé avec succès !");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite lors de la suppression de l'utilisateur.");
    }
  };
 
  const handleSearch = async (event) => {
    event.preventDefault(); // Empêcher le comportement par défaut du formulaire
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/userList/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUtilisateurs(response.data); 
      if (searchQuery === '') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors de la recherche des utilisateurs :', error);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
     <section id="sidebar" className={showSidebar ? "show" : "hide"}>
        <a href="#" className="brand">
          <i className='bx bxs-smile'></i>
          <span className="text">RadioClic</span>
        </a>
        <ul className="side-menu top">
          <li className="active">
            <a href="/gererUtilisateur">
              <i className='bx bxs-dashboard' ><FontAwesomeIcon icon={faHouse}/></i>
              <span className="text">Tableau de bord</span>
            </a>
          </li>
          <li>
            <a href="/compteAdmin">
              <i className='bx bxs-shopping-bag-alt' ><FontAwesomeIcon icon={faUser}/></i>
              <span className="text">Mon compte</span>
            </a>
          </li>
        </ul>

      </section>
      <section id="content" className={showSidebar ? "expanded" : "collapsed"}>
      <nav>
<i className='bx bx-menu' onClick={handleToggleSidebar}><FontAwesomeIcon icon={faBars} /></i>
<h6 className='profile-name'>{user.nom} {user.prenom}</h6>
<form onSubmit={handleSearch}>
            <div className="form-input">
              <input type="search" placeholder="Rechercher par nom et prenom..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button type="submit" className="search-btn">
                <i className='bx bx-search'><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
              </button>
            </div>
          </form>
          <div className={`profiletoggle ${showProfileInfo ? 'active' : ''}`} onClick={handleProfileClick}>
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


<a href="#!" onClick={handleLogout} className="logoutuser">
        <FontAwesomeIcon icon={faRightFromBracket} />
      </a>
        </nav>
        <main>
   <div className="head-title">
     <div className="left">
       <h2> <FontAwesomeIcon icon={faHouse}/> Bienvenue </h2>
     </div>
   </div>

   <div>
     <ul className="box-info">
     <li>
       <i className='bx bxs-calendar-check' ><FontAwesomeIcon icon={faUserDoctor}/></i>
       <span className="text">
         <h3>{nbreRadiologues}</h3>
         <p>Nombre des Radiologues</p>
       </span>
     </li>
     <li>
       <i className='bx bxs-group' ><FontAwesomeIcon icon={faUserNurse}/></i>
       <span className="text">
         <h3>{nbreTechniciens}</h3>
         <p>Nombre des Techniciens</p>
       </span>
     </li>
     <li>
       <i className='bx bxs-dollar-circle' ><FontAwesomeIcon icon={faHospitalUser} /></i>
       <span className="text">
         <h3>{nbreSecretaires}</h3>
         <p>Nombre des Secrétaires</p>
       </span>
     </li>
   </ul>
   </div>
   <div className="list">
      <div className="ajouter">
        <h2 className="gestion">Gestion des utilisateurs</h2>
        <div className='buttons'>
        <div className="filters">
              <button onClick={fetchSecretaires}>Secrétaires</button>
              <button onClick={fetchRadiologues}>Radiologues</button>
              <button onClick={fetchTechniciens}>Techniciens</button>
      </div>
        <button id="btnAddUser" onClick={() => navigate("/Ajouter")}>Ajouter un utilisateur</button>
        </div>
      </div>

      <div className="userList">
        <table className="tableuser">
          <thead>
            <tr>
              <th>Nom complet</th>
              <th>Email</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((utilisateur) => (
              <tr key={utilisateur._id}>
                <td>{utilisateur.nom} {utilisateur.prenom}</td>
                <td>{utilisateur.email}</td>
                <td>{utilisateur.typedecompte}</td>
                <td>
                  <button className="modifieruser" title='modifier cet utilisateur' onClick={() => { handleModifyClick(utilisateur.email) }}>
                    <FontAwesomeIcon icon={faUserPen} />
                  </button>
                  <button className="supprimeruser" title='supprimer cet utilisateur' onClick={() => supprimerUtilisateur(utilisateur._id)}>
                    <FontAwesomeIcon icon={faTrash} /> 
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

export default GererUtilisateur;