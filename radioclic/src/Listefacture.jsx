import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Listefacture.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCalendarDays, faHouse, faUser, faTrash, faFolderOpen,  faCircleArrowLeft, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";
import { useParams, useNavigate } from "react-router-dom";

function Listefacture() {
    const navigate = useNavigate();
    const {patientId} = useParams();
    const [factures, setFactures] = useState([]);
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
    

    const handleModiferFacture = (factureId) => {
        navigate(`/modifierFacture/${factureId}`);
      };

      useEffect(() => {
        const fetchFactures = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/factures/list-facture/${patientId}`); 
            setFactures(response.data.factures);
          } catch (error) {
            console.error('Erreur lors de la récupération des factures:', error);
          }
        };
    
        fetchFactures();
      }, []);

      const handleSupprimerFacture = async (factureId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
            try {
                await axios.delete(`http://localhost:5000/api/factures/delete-facture/${factureId}`);
                setFactures(factures.filter(facture => facture._id !== factureId));
                toast.success("Facture supprimée avec succès !");
            } catch (error) {
                console.error("Erreur lors de la suppression de la facture :", error);
                toast.error("Erreur lors de la suppression de la facture.");
            }
        }
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

      const handleLogout = () => {
        localStorage.removeItem("token");
        // Rediriger vers la page de connexion ou une autre page appropriée
        navigate("/login");
      }; 

    return(
        <div>
            <section id="sidebar">
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
                <h2 className='listfac'>Liste des factures :</h2>
                <div className="container">
                {factures.length === 0 ? (
          <p className='msg'>Aucune facture pour le moment</p>
        ) : (
                    <div className="invoice-list">
                    <ul>
                        {factures.map((facture) => (
                            <li key={facture._id} className="invoice">
                                <div className="invoice-info">
                                    <p><FontAwesomeIcon icon={faCalendarDays} />  Date:    {formatDate(facture.date_facture) } </p>
                                    <p><FontAwesomeIcon icon={faSackDollar} /> Montant:    {facture.montant} dt</p>
                                </div>
                                <div className="invoice-actions">
                                    <button className="btn-open" title='ouvrir facture' onClick={() => handleModiferFacture(facture._id)}><FontAwesomeIcon icon={faFolderOpen} />  Ouvrir</button>
                                    <button className="btn-delete" title='supprimer facture' onClick={() => handleSupprimerFacture(facture._id)}><FontAwesomeIcon icon={faTrash} /> Supprimer</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    </div>
                    )}
                </div>
                </section>
        </div>

    );
 }
 export default Listefacture;