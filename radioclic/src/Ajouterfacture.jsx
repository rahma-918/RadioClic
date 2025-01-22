import React, { useState , useEffect} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import './Ajouterfacture.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faTrash, faMagnifyingGlass, faHouse, faUser,  faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";

function Ajouterfacture() {
    const {patientId} = useParams();
    const [montant, setMontant] = useState('');
    const navigate = useNavigate();
    const [patientInfo, setPatientInfo] = useState({});
    const [showSidebar, setShowSidebar] = useState(true);
    const [user, setUser] = useState({});
    const [showProfileInfo, setShowProfileInfo] = useState(false);

    const handleProfileClick = () => {
      setShowProfileInfo(!showProfileInfo);
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      // Rediriger vers la page de connexion ou une autre page appropriée
      navigate("/login");
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
        const fetchPatientInfo = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5000/api/factures/patient-info/${patientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                setPatientInfo(data);
            } catch (error) {
                console.error('Error fetching patient info:', error);
            }
        };

        fetchPatientInfo();
    }, [patientId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`http://localhost:5000/api/factures/create-facture/${patientId}`, {
                montant: montant
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const createdFacture = response.data.facture;
            toast.success(response.data.message);
            navigate(`/modifierFacture/${createdFacture._id}`);
        } catch (error) {
            console.error('Error creating facture:', error);
            toast.error('Erreur lors de la création de la facture');
        }
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
                    <a href="/competSec">
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
          <form action="#">
            <div className="form-input">
              <input type="search" placeholder="Rechercher..."/>
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
        <div className="invoice-container">
            <h1>Ajouter une facture</h1>
            <form onSubmit={handleSubmit}>
                        <div className="invoice-details">
                            <div>
                                <label htmlFor="nom">Nom du patient:</label>
                                <input type="text" id="nom" value={`${patientInfo.nom_patient} ${patientInfo.prenom}`} readOnly />
                            </div>
                            <div>
                                <label htmlFor="telephone">Téléphone:</label>
                                <input type="tel" id="telephone" value={patientInfo.telephone} readOnly />
                            </div>
                            <div>
                                <label htmlFor="typederadiologie">Type de l'examen:</label>
                                <input type="text" id="typederadiologie" value={patientInfo.typederadiologie} readOnly />
                            </div>
                            <div>
                                <label htmlFor="montant">Montant (DT):</label>
                                <input type="text" id="montant" value={montant} onChange={(e) => setMontant(e.target.value)}/>
                            </div>
                            <div>
                                <label htmlFor="date">Date:</label>
                                <input type="date" id="date" value={new Date().toISOString().slice(0, 10)} readOnly />
                            </div>
                            <button type="submit" className="save-btn">Enregistrer</button>
                        </div>
                    </form>
        </div>
        </section>
        </div>
    );
}

export default Ajouterfacture;
