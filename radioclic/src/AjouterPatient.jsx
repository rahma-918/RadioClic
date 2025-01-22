import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import './AjouterPatient.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";
import { useNavigate } from "react-router-dom";
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
function AjouterPatient() {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
    telephone: "",
    typedecompte:"",
    sexe: "",
    datedenaissance: ""
  });
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Rediriger vers la page de connexion ou une autre page appropriée
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Veuillez entrer une adresse email valide.");
      return;
    }
  
    // Vérification du format du numéro de téléphone
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(formData.telephone)) {
      toast.error("Veuillez entrer un numéro de téléphone composé de 8 chiffres.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/user/signup", formData);
      toast.success(response.data.message);
      await createMedicalRecord(response.data.userId);
      await createReport(response.data.userId);
      // Réinitialiser le formulaire après soumission réussie 
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        motdepasse: "",
        telephone: "",
        typedecompte: "",
        sexe: "",
        datedenaissance: ""

      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const createMedicalRecord = async (userId) => {
    try {
        await axios.post(`http://localhost:5000/api/dossier-medical/create-medical-record/${userId}`);
    } catch (error) {
        console.error("Erreur lors de la création du dossier médical :", error);
    }
  };
  
  
  const createReport = async (userId) => {
    try {
      await axios.post(`http://localhost:5000/api/dossier-medical/create-report/${userId}`);
    } catch (error) {
      console.error("Erreur lors de la création du rapport médical :", error);
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
   <li>
     <a href="/dashboardSec">
       <i className='bx bxs-dashboard' ><FontAwesomeIcon icon={faHouse}/></i>
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
       <main className="utilisateurpatient">

        <section className="nouveaupatient">
            <h2 className="ajouterpatient">Ajouter un Patient:</h2>
            <form className="formpatient" onSubmit={handleSubmit}>
            <label htmlFor="nom" className="label">Nom :</label>
                <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} placeholder="Entrer le nom du patient"/><br></br>
                <label htmlFor="prenom" className="label">Prénom :</label>
                <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Entrer le prenom du patient"/><br></br>
                <label htmlFor="email" className="label">Email :</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Entrer l'adresse email du patient"/><br></br>
                <label htmlFor="motdepasse" className="label">Mot de passe :</label>
                <input id="motdepasse" name="motdepasse" type={showPassword ? "text" : "password"} value={formData.motdepasse} onChange={handleChange} placeholder="Entrer le mot de passe du patient"/><br></br>
                <label htmlFor="telephone" className="label">Télephone :</label>
                <input type="text" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Entrer le numéro de téléphone du patient"/><br></br>
                <label htmlFor="typedecompte" className="label">Type de compte :</label>
    <select id="typedecompte" name="typedecompte" value={formData.typedecompte} onChange={handleChange}>
        <option value="" defaultValue>Select...</option>
        <option value="Patient">Patient</option>
    </select><br></br>
    <label htmlFor="sexe" className="labelpatient">Sexe :</label>
    <select id="sexe" name="sexe" value={formData.sexe} onChange={handleChange}>
        <option value="" defaultValue>Select...</option>
        <option value="Masculin">Homme</option>
        <option value="Féminin">Femme</option>
    </select><br></br>
    <label htmlFor="datedenaissance" className="labelpatient">Date de naissance :</label>
    <input type="date" id="datedenaissance" name="datedenaissance" value={formData.datedenaissance} onChange={handleChange}/><br></br>

    <input type="submit" value="Enregistrer "/>
</form>

        </section>
    </main>
    </section>
    </div>
  );
}

export default AjouterPatient;
