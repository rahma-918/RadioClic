import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import './Ajouter.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandSpock } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";
import { useNavigate } from "react-router-dom";
function Ajouter() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
    telephone: "",
    typedecompte: ""
  });
  const [showSidebar, setShowSidebar] = useState(true);
  const [user, setUser] = useState({});
  const [showProfileInfo, setShowProfileInfo] = useState(false);

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      // Réinitialiser le formulaire après soumission réussie 
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        motdepasse: "",
        telephone: "",
        typedecompte: ""
      });
    } catch (error) {
      toast.error(error.response.data.message);
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
     <a href="gererUtilisateur">
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
       <main className="utilisateur">

        <section className="nouveau">
            <h2 className="ajouter">Ajouter un nouveau utilisateur:</h2>
            <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="nom" className="label">Nom :</label>
                <input type="text" id="nom" name="nom" placeholder="nom de l'utilisateur" value={formData.nom} onChange={handleChange}/><br></br>
                <label htmlFor="prenom" className="label">Prénom :</label>
                <input type="text" id="prenom" name="prenom" placeholder="prenom de l'utilisateur" value={formData.prenom} onChange={handleChange}/><br></br>
                <label htmlFor="email" className="label">Email :</label>
                <input type="email" id="email" name="email" placeholder="utilisateur@gmail.com" value={formData.email} onChange={handleChange}/><br></br>
                <label htmlFor="motdepasse" className="label">Mot de passe :</label>
                <input id="motdepasse" name="motdepasse" placeholder="mot de passe de l'utilisateur" type={showPassword ? "text" : "password"} value={formData.motdepasse} onChange={handleChange}/><br></br>
                <label htmlFor="telephone" className="label">Télephone :</label>
                <input type="text" id="telephone" name="telephone" placeholder="73125849" value={formData.telephone} onChange={handleChange}/><br></br>
                <label htmlFor="typedecompte" className="label">Type de compte :</label>
    <select id="typedecompte" name="typedecompte" value={formData.typedecompte} onChange={handleChange}>
        <option value="" defaultValue>Select...</option>
        <option value="Secretaire">Secrétaire</option>
        <option value="Radiologue">Radiologue</option>
        <option value="Technicien en imagerie">Technicien</option>
    </select><br></br>
                <input type="submit" value="Enregistrer "/>
            </form>
        </section>
    </main>
    </section>
    </div>
  );
}

export default Ajouter;
