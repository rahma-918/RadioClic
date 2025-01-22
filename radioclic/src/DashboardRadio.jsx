import React, { useState , useEffect} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import './DashboardRadio.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";
import { faSkull, faBone, faXRay } from '@fortawesome/free-solid-svg-icons'
import { useNavigate} from "react-router-dom";

function DashboardRadio() {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
};
  const [nbreIRM, setNbreIRM]= useState(0);
  const [nbreScanner, setNbreScanner]= useState(0);
  const [nbreRadiographie, setNbreRadiographie]=useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [user, setUser] = useState({});

  const [showProfileInfo, setShowProfileInfo] = useState(false);

  const handleProfileClick = () => {
    setShowProfileInfo(!showProfileInfo);
  };

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar); // Inverse l'état actuel du sidebar
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

  useEffect(() => {
    const fetchNbreIRM = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/statistique/IRM/count");
            if (response.data.success) {
                setNbreIRM(response.data.count);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching number of IRM:", error);
        }
    };
  
    fetchNbreIRM ();
  }, []);

  useEffect(() => {
    const fetchNbreScnner = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/statistique/scanner/count");
            if (response.data.success) {
                setNbreScanner(response.data.count);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching number of IRM:", error);
        }
    };
  
    fetchNbreScnner ();
  }, []);

  useEffect(() => {
    const fetchNbreRadiographie = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/statistique/radiographie/count");
            if (response.data.success) {
                setNbreRadiographie(response.data.count);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching number of IRM:", error);
        }
    };
  
    fetchNbreRadiographie ();
  }, []);

  const navigate = useNavigate();
  const handleDossierMedicalClick = (patientId) => {
    navigate(`/dossierRadio/${patientId}`);
  };
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/userList/patients-radio'); 
        const patientsData = response.data.patients;
        const patientsWithModificationDate = await Promise.all(patientsData.map(async (patient) => {
          const modificationResponse = await axios.get(`http://localhost:5000/api/dossier-medical/dossier-modification/${patient._id}`);
          return {
            ...patient,
            date_modification: modificationResponse.data.date_modification
          };
        }));
        setPatients(patientsWithModificationDate); // Mettre à jour l'état des patients
      } catch (error) {
        console.error('Erreur lors de la récupération des patients:', error);
      }
    };
  
    fetchPatients();
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
          <li className="active">
            <a href="/dashboardRadio">
              <i className='bx bxs-dashboard' ><FontAwesomeIcon icon={faHouse}/></i>
              <span className="text">Tableau de bord</span>
            </a>
          </li>
          <li>
            <a href="/compteRadio">
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
        <h2 className="bienvenue"> <FontAwesomeIcon icon={faHouse}/> Bienvenue </h2>
        <div>
   <ul className="box-info">
   <li>
     <i className='bx bxs-calendar-check' ><FontAwesomeIcon icon={faSkull}/></i>
     <span className="text">
       <h3>{nbreIRM}</h3>
       <p>Nombre des IRM </p>
     </span>
   </li>
   <li>
     <i className='bx bxs-group' ><FontAwesomeIcon icon={faBone}/></i>
     <span className="text">
       <h3>{nbreScanner}</h3>
       <p>Nombre des scanners </p>
     </span>
   </li>
   <li>
     <i className='bx bxs-dollar-circle' ><FontAwesomeIcon icon={faXRay}/></i>
     <span className="text">
       <h3>{nbreRadiographie}</h3>
       <p>Nombre des radiologies </p>
     </span>
   </li>
 </ul>
 </div>
            <div>
                <div className="rapport">
                    <h2 className="patient">Liste Des Patients :</h2>
                </div>
                <div className="dossier">
                    <table className="tablepatient">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Date de dernière modification</th>
                                <th>Accès au dossier médical</th>
                            </tr>
                        </thead>
                        <tbody>
                        {patients.filter(patient => patient !== null).map((patient) => (
    <tr key={patient._id}>
        <td>{patient.nom} {patient.prenom}</td>
        <td>{patient.email}</td>
        <td>{patient.date_modification ? formatDateTime(patient.date_modification) : 'N/A'}</td>
        <td>
            <button className="ouvrirDossier" title="accéder au dossier médical" onClick={() => handleDossierMedicalClick(patient._id)}>
                <FontAwesomeIcon icon={faFolderOpen} />
            </button>
        </td>
    </tr>
))}
                        </tbody>
                    </table>
                </div>
            </div>
            /</section>
        </div>
    );
}

export default DashboardRadio;
