import * as React from "react";
import toast from "react-hot-toast";
import './Homepatient.css';
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
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import { faSkull } from '@fortawesome/free-solid-svg-icons'
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { faCoins} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Homepatient () {
  const [numberOfAppointments, setNumberOfAppointments] = useState(0);
  const [numberOfRadiologies, setNumberOfRadiologies] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  const [futursRDV, setFutursRDV] = useState([]);
  const [factures, setFactures] = useState([]);
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
    const fetchNumberOfAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/statistique/rendez-vous/count", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setNumberOfAppointments(response.data.count);
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
  const fetchNumberOfRadiologies = async () => {
      try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:5000/api/statistique/radiologies/count", {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
              setNumberOfRadiologies(response.data.count);
          } else {
              console.error(response.data.message);
          }
      } catch (error) {
          console.error("Error fetching number of radiologies:", error);
      }
  };

  fetchNumberOfRadiologies();
}, []);

useEffect(() => {
  const fetchTotalMoney = async () => {
      try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:5000/api/statistique/factures/sum", {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
              setTotalMoney(response.data.sum);
          } else {
              console.error(response.data.message);
          }
      } catch (error) {
          console.error("Error fetching total des frais payés:", error);
      }
  };

  fetchTotalMoney();
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
  const fetchFutursRDV = async () => {
      try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:5000/api/rendez-vous/futurs-rendezvous", {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
              setFutursRDV(response.data.futursRDV);
          } else {
              console.error(response.data.message);
          }
      } catch (error) {
          console.error("Error fetching les futurs rendez vous:", error);
      }
  };

  fetchFutursRDV();
}, []);


const handleAnnulerRendezVous = async (id) => {
  const confirmation = window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?");
  
  if (confirmation) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:5000/api/historique/annuler-rendezvous/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setFutursRDV(prevState => prevState.filter(rdv => rdv._id !== id));
        toast.success("Rendez-vous annulé avec succès !");
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation du rendez-vous :", error);
    }
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  // Rediriger vers la page de connexion ou une autre page appropriée
  navigate("/login");
}; 

  
return(
  <div> 
    <section id="sidebar" className={showSidebar ? "show" : "hide"}>
<a href="#" className="brand">
       <i className='bx bxs-smile'></i>
 <span className="text">RadioClic</span>
</a>
<ul className="side-menu top">
 <li className="active">
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
 <li>
   <a href="historique">
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
 <div className="head-title">
   <div className="left">
     <h2> <FontAwesomeIcon icon={faHouse}/> Bienvenue </h2>
   </div>
 </div>

 <div>
   <ul className="box-info">
   <li>
     <i className='bx bxs-calendar-check' ><FontAwesomeIcon icon={faCalendarCheck}/></i>
     <span className="text">
       <h3>{numberOfAppointments}</h3>
       <p>Nombre de rendez vous</p>
     </span>
   </li>
   <li>
     <i className='bx bxs-group' ><FontAwesomeIcon icon={faSkull}/></i>
     <span className="text">
       <h3>{numberOfRadiologies}</h3>
       <p>Nombre des imageries médicales</p>
     </span>
   </li>
   <li>
     <i className='bx bxs-dollar-circle' ><FontAwesomeIcon icon={faCoins} /></i>
     <span className="text">
       <h3>{totalMoney} dt</h3>
       <p>Total des frais payés</p>
     </span>
   </li>
 </ul>
 </div>
 <div className="table-data">
      <div className="order">
        <p className="orderp">Liste des rendez-vous en attente :</p>
        <table className="tableorder">
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Type d'examen</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {futursRDV.map((rdv) => (
            <tr key={rdv._id}>
              <td>{formatDate(rdv.date)}</td>
              <td>{rdv.heure}</td>
              <td>{rdv.typeRadiologie}</td>
              <td>
              <button className="annuler-buttonorder" title="annuler ce rendez vous" onClick={() => handleAnnulerRendezVous(rdv._id)}>
               <FontAwesomeIcon icon={faBan}/> Annuler
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="todo">
        <p className="todop">Liste des factures :</p>
        <div className="cadre-factures">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>type d'examen</th>
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
    

      </div>
    
  </div>
 </main>
</section>
  </div>
  );
}
export default Homepatient;