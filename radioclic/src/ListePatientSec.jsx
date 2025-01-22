import React, { useState , useEffect} from "react";
import './ListePatientSec.css';
import axios from "axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUserPen, faTrash, faMagnifyingGlass, faHouse, faUser,  faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate} from "react-router-dom";
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";

import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'


function ListePatientSec() {
    const navigate = useNavigate();
    const handleModifyClick = (userEmail) => {
      navigate(`/modifierPatient/${userEmail}`);
    };

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



  const [patients, setPatients] = useState([]);

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
      const fetchPatients = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/userList/patients'); 
          setPatients(response.data.patients);
        } catch (error) {
          console.error('Erreur lors de la récupération des patients:', error);
        }
      };
  
      fetchPatients();
    }, []);

    const supprimerPatient = async (id) => {
      try {
        // Afficher une popup de confirmation
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?");
    
        if (confirmation) {
          // Si l'utilisateur confirme la suppression, alors supprimer l'utilisateur
          await axios.delete(`http://localhost:5000/api/userList/deleteUsers/${id}`);
          // Mettre à jour la liste des utilisateurs après la suppression
          const updatedPatients = patients.filter((patient) => patient._id !== id);
          setPatients(updatedPatients);
          toast.success("Patient supprimé avec succès !");
        }
      } catch (error) {
        console.error(error);
        toast.error("Une erreur s'est produite lors de la suppression de patient.");
      }
    };


    const handleLogout = () => {
      localStorage.removeItem("token");
      // Rediriger vers la page de connexion ou une autre page appropriée
      navigate("/login");
    }; 

    const handleSearch = async (event) => {
      event.preventDefault(); // Empêcher le comportement par défaut du formulaire
    
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/userList/search-patients?query=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPatients(response.data); 
        if (searchQuery === '') {
          window.location.reload();
        }
      } catch (error) {
        console.error('Erreur lors de la recherche des patients :', error);
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
                    <li>
                        <a href="/dashboardSec">
                            <i className='bx bxs-dashboard'><FontAwesomeIcon icon={faHouse} /></i>
                            <span className="text">Tableau de bord</span>
                        </a>
                    </li>
                    <li className="active">
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
                <div className="list-container">
                    <div className="ajouterfacture">
                        <h2 className="gestion-title">Gestion des patients</h2>
                        <button className="ajouter-patient" onClick={() => navigate("/ajouterPatient")}>Ajouter un patient</button>
                    </div>
                    <div className="list-user">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Date de Naissance</th>
                                    <th>Téléphone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient._id}>
                                        <td>{patient.nom} {patient.prenom}</td>
                                        <td>{patient.email}</td>
                                        <td>{formatDate(patient.datedenaissance)}</td>
                                        <td>{patient.telephone}</td>
                                        <td>
                                            <button className="modifier-user-btn" title="modifier" onClick={() => handleModifyClick(patient.email)}>
                                                <FontAwesomeIcon icon={faUserPen} />
                                            </button>
                                            <button className="supprimer-user-btn" title="supprimer" onClick={() => supprimerPatient(patient._id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ListePatientSec;
