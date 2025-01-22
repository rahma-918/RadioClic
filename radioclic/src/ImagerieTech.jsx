import React, { useState, useEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import User from "../src/assets/user.jpg";
import axios from "axios";
import toast from "react-hot-toast";
import './ImagerieTech.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardUser, faHourglassStart, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import {  faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";


function ImagerieTech () {
    const [radiologie, setRadiologie]= useState({});
    const [imagerie, setImagerie] = useState({});
    const [rendezVous, setRendezVous]= useState({});
    const [technicien, setTechnicien]= useState({});
    const {appointmentId}= useParams();
    const [showSidebar, setShowSidebar] = useState(true);
    const [user, setUser] = useState({});
    const fileInputRef = useRef(null); 
    const navigate= useNavigate();

    const [showProfileInfo, setShowProfileInfo] = useState(false);
  
    const handleProfileClick = () => {
      setShowProfileInfo(!showProfileInfo);
    };
  
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
        const fetchRadiologie = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/dossier-medical/radiologie/${appointmentId}`);
                if (response.data.success) {
                  setRadiologie(response.data.radiologie);
              } else {
                  console.error(response.data.message);
              }
            } catch (error) {
                console.error("Error fetching radiologie:", error);
            }
        };
    
        fetchRadiologie();
    }, []);
    useEffect(() => {
      const fetchRadiologieInfo = async () => {
          try {
              const response = await axios.get(`http://localhost:5000/api/dossier-medical/radio-info/${appointmentId}`);
              if (response.data.success) {
                setImagerie(response.data.radiologie);
                setRendezVous(response.data.rendezVous);
                setTechnicien(response.data.technicien);
            } else {
                console.error(response.data.message);
            }
          } catch (error) {
              console.error("Error fetching radiologie info:", error);
          }
      };
  
      fetchRadiologieInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Rediriger vers la page de connexion ou une autre page appropriée
    navigate("/login");
  }; 

  const handleModifyClick = () => {
    fileInputRef.current.click(); // Ouvre l'explorateur de fichiers
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:5000/api/rendez-vous/update-image/${radiologie._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success("Image mise à jour avec succès");
        setRadiologie(response.data.radiologie);
        window.location.reload(); // Recharger la page pour afficher la nouvelle image
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'image");
      console.error("Error updating image:", error);
    }
  }
};

const handleDeleteClick = async () => {
  const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
  if (!confirmDelete) {
    return; 
  }
  try {
    const response = await axios.delete(`http://localhost:5000/api/rendez-vous/supprimer-radio/${radiologie._id}`);
    if (response.status === 200) {
      toast.success("Image supprimée avec succès");
      setRadiologie({});
      navigate('/dashboardTech');
    } else {
      toast.error("Erreur lors de la suppression de l'image");
    }
  } catch (error) {
    toast.error("Erreur lors de la suppression de l'image");
    console.error("Error deleting image:", error);
  }
};

    return(
        <div>
            <section id="sidebar">
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
        <div className="flex-container">

        <div className="image-container">
            <img src={radiologie.imageUrl} 
            style={{ width: "460px", height: "500px" }} 
            alt="Image radiologique"/>
        </div>

        <div className="info-container">
            <h2>Informations sur l'imagerie</h2>
            <p><strong>Type :</strong>{imagerie.type} </p>
            <p><strong>Date :</strong>{formatDate(imagerie.date_creation)} </p>
            <p><strong>Heure :</strong> {rendezVous.heure}</p>
            <p><strong>Technicien :</strong>{technicien.nom} {technicien.prenom}</p>
        </div>
       </div>

        <div className="button-cont">
        <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
              <button onClick={handleModifyClick}><FontAwesomeIcon icon={faPenToSquare} /> Modifier l'image</button>
              <button className="delete" title="supprimer l'image" onClick={handleDeleteClick}>
              <FontAwesomeIcon icon={faTrash} /> Supprimer l'image
            </button>
        </div>
        </main>
        </section>
      </div>
    );
}
export default ImagerieTech;