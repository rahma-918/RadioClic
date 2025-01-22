import React, { useState, useEffect, useRef } from "react";
import User from "../src/assets/user.jpg";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import './DashboardTech.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import { faHourglassStart, faChalkboardUser, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'


function DashboardTech () {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedRendezvousId, setSelectedRendezvousId] = useState(null);
  const [totalRDV, setTotalRDV]= useState(0);
  const [RDVAccomplis, setRDVAccomplis]= useState(0);
  const [RDVEnAttente, setRDVEnAttente]= useState(0);
  const [imagerieAdded, setImagerieAdded] = useState({});
  const [user, setUser] = useState({});
  const [imagerieStatus, setImagerieStatus] = useState({});
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);

  const [showProfileInfo, setShowProfileInfo] = useState(false);

  const handleProfileClick = () => {
    setShowProfileInfo(!showProfileInfo);
  };

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar); // Inverse l'état actuel du sidebar
  };


  useEffect(() => {
    const fetchNbreRDVTotal = async () => {
        try {
          const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/statistique/rendez-vous-technicien/count",{
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setTotalRDV(response.data.count);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching number of rendez vous:", error);
        }
    };
  
    fetchNbreRDVTotal ();
  }, []);
  useEffect(() => {
    const fetchNbreRDVAccomplis = async () => {
        try {
          const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/statistique/rendez-vous-accompli/count", {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setRDVAccomplis(response.data.count);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching number of rendez vous:", error);
        }
    };
  
    fetchNbreRDVAccomplis ();
  }, []);

  useEffect(() => {
    const fetchNbreRDVEnAttente = async () => {
        try {
          const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/statistique/rendez-vous-en-attente/count", {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setRDVEnAttente(response.data.count);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching number of rendez vous:", error);
        }
    };
  
    fetchNbreRDVEnAttente ();
  }, []);

  const fileInputRef = useRef(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/api/rendez-vous/rendez-vous/technicien', {
          headers: { Authorization: `Bearer ${token}` }
        }); 
        setPatients(response.data.patients);
        setAppointments(response.data.rendezvous);
      } catch (error) {
        console.error('Erreur lors de la récupération des rendez vous:', error);
      }
    };

    fetchData();
  }, []);

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
  
  
  
  
  const handleAddImagerie = async (rendezvousId) => {
    try {
      setSelectedRendezvousId(rendezvousId);
      const fileInput = fileInputRef.current;
      if (fileInput) {
        fileInput.click(); // Cliquez sur l'input file pour ouvrir la fenêtre de sélection de fichier
      } else {
        console.error("fileInputRef is not assigned");
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      toast.error("Erreur lors de la sélection du fichier");
    }
  };
  
  const handleImageUpload = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
  
      const token = localStorage.getItem("token");
      const response = await axios.post(`http://localhost:5000/api/rendez-vous/upload/${selectedRendezvousId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      const imageId = response.data.newImage._id;
      setImagerieAdded(prevState => ({ ...prevState, [selectedRendezvousId]: imageId }));
  
      toast.success(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Erreur lors de l'ajout de l'image");
    }
  };
  

const handleViewImagerie = (appointmentId) => {
    navigate(`/imagerieTech/${appointmentId}`);

}; 

const isAccompli = (hasImagerie) => {
  return hasImagerie; // Le rendez-vous est considéré comme accompli s'il y a une imagerie ajoutée
};

const handleLogout = () => {
  localStorage.removeItem("token");
  // Rediriger vers la page de connexion ou une autre page appropriée
  navigate("/login");
};  

useEffect(() => {
  const fetchImagerieStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const statusPromises = appointments.map(async (appointment) => {
        const response = await axios.get(`http://localhost:5000/api/rendez-vous/check-radiologie/${appointment._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return { appointmentId: appointment._id, exists: response.data.exists };
      });
      const statusResults = await Promise.all(statusPromises);
      const statusObj = statusResults.reduce((acc, result) => {
        acc[result.appointmentId] = result.exists;
        return acc;
      }, {});
      setImagerieStatus(statusObj);
    } catch (error) {
      console.error("Error fetching imagerie status:", error);
    }
  };

  fetchImagerieStatus();
}, [appointments]);
      
return(
  <div>
      <section id="sidebar" className={showSidebar ? "show" : "hide"}>
        <div className="top">
        <a href="#" className="brand">
    <i className='bx bxs-smile'></i>
    <span className="text">RadioClic</span>
  </a>
  </div>
  <ul className="side-menu top">
    <li className="active">
      <a href="/dashboardTech">
        <i className='bx bxs-dashboard' ><FontAwesomeIcon icon={faHouse}/></i>
        <span className="text">Tableau de bord</span>
      </a>
    </li>
    <li>
      <a href="/compteTech">
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
  <main>
<div className="head-title">
<div className="left">
 <h2> <FontAwesomeIcon icon={faHouse}/> Bienvenue </h2>
</div>
</div>

<div>
<ul className="box-info">
<li>
 <i className='bx bxs-calendar-check' ><FontAwesomeIcon icon={faChalkboardUser}/></i>
 <span className="text">
   <h3>{totalRDV}</h3>
   <p>Nombre total des  rendez-vous</p>
 </span>
</li>
<li>
 <i className='bx bxs-group' ><FontAwesomeIcon icon={faCalendarCheck}/></i>
 <span className="text">
 <h3>{RDVAccomplis}</h3>
   <p> rendez-vous accomplis</p>
 </span>
</li>
<li>
 <i className='bx bxs-dollar-circle' ><FontAwesomeIcon icon={faHourglassStart} /></i>
 <span className="text">
 <h3>{RDVEnAttente}</h3>
   <p> rendez-vous en attente</p>
 </span>
</li>
</ul>
</div>
          <div className="patient">
            <h2>Liste des Rendez-vous</h2>
          <table className="tableau">
              <thead>
              <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Heure de rendez vous</th>
                  <th>Type d'Imagerie</th>
                  <th>Statut</th> 
                  <th>Actions</th>
              </tr>
              </thead>
              <tbody>
  {appointments.map((appointment) => {
    // Trouver les détails du patient associé à ce rendez-vous
    const patient = patients.find((p) => p._id === appointment.patient);

    return (
      <tr key={appointment._id}>
        <td>{patient.nom}</td>
        <td>{patient.prenom}</td>
        <td>{appointment.heure}</td>
        <td>{appointment.typeRadiologie}</td>
        <td>{isAccompli(imagerieStatus[appointment._id]) ? "accompli" : "en attente"}</td>
        <td>
        {imagerieStatus[appointment._id] ? (
  <button className="Imagerie" onClick={() => handleViewImagerie(appointment._id)}>
    Voir Imagerie
  </button>
) : (
  <>
    <button className="Imagerie" onClick={() => handleAddImagerie(appointment._id)}>
      Ajouter Imagerie
    </button>
    
  </>
)}
        </td>
      </tr>
    );
  })}
</tbody>

          </table>
          <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={(e) => handleImageUpload(e.target.files[0])} />
          </div>
          </main>
</section>
</div>
);
}
export default DashboardTech;