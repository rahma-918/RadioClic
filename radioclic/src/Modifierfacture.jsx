import React, { useState , useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import './Modifierfacture.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faHouse, faUser,  faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck, faFileInvoiceDollar, faDownload } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";

function Modifierfacture() {
    const {factureId} = useParams();
    const [facture, setFacture]= useState({});
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
        const fetchFacture = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/factures/facture-info/${factureId}`); 
            setFacture(response.data.facture);
          } catch (error) {
            console.error('Erreur lors de la récupération de la facture:', error);
          }
        };
    
        fetchFacture();
      }, [factureId]);

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

      const handleDownloadPDF = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/dossier-medical/telecharger-pdf/${factureId}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `facture-${factureId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Facture téléchargée avec succès");
        } catch (error) {
            console.error('Erreur lors du téléchargement du PDF de la facture:', error);
            toast.error('Erreur lors du téléchargement du PDF de la facture');
        }
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      // Rediriger vers la page de connexion ou une autre page appropriée
      navigate("/login");
    }; 

    return (
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
            <div className="facture-container">
    <h1><FontAwesomeIcon  icon={faFileInvoiceDollar}/> Facture:</h1>
    <form>
            <div className="facture-details">
                <div>
                    <label htmlFor="patientName">Nom du patient:</label>
                    <input type="text" id="patientName" value={facture.nom_patient ? facture.nom_patient : ''} readOnly/>
                </div>
                <div>
                    <label htmlFor="phone">Téléphone:</label>
                    <input type="tel" id="phone" value={facture.telephone ? facture.telephone : ''} readOnly/>
                </div>
                <div>
                    <label htmlFor="typederadiologie">Type de l'examen:</label>
                    <input type="text" id="typederadiologie" value={facture.typederadiologie ? facture.typederadiologie : ''} readOnly/>
                </div>
                <div>
                    <label htmlFor="amount">Montant:</label>
                    <input type="text" id="amount"  value={facture.montant ? facture.montant : ''} readOnly/>
                </div>
                <div>
                    <label htmlFor="text">Date:</label>
                    <input type="text" id="date" value={facture.date_facture ? formatDate(facture.date_facture) : ''} readOnly />
                </div>
                <button type="button" className="télécharger" title="télécharger facture pdf" onClick={handleDownloadPDF}>
                 <FontAwesomeIcon icon={faDownload} /> Télécharger
                </button>
            </div>
        </form>
</div>

        </section>
        </div>
    );
}

export default Modifierfacture;
