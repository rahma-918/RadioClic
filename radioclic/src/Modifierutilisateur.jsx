import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import './Modifierutilisateur.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function Modifierutilisateur(){
  const [patientInfo, setPatientInfo] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });
  const {userEmail} = useParams();
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
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/userList/userByEmail/${userEmail}`);
        setPatientInfo(response.data.user);
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la récupération des informations de l'utilisateur.");
      }
    };

    fetchUserInfo();
  }, [userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
    
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(patientInfo.email)) {
      toast.error("Veuillez entrer une adresse email valide.");
      return;
    }
  
    // Vérification du format du numéro de téléphone
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(patientInfo.telephone)) {
      toast.error("Veuillez entrer un numéro de téléphone composé de 8 chiffres.");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/userList/updateUser/${patientInfo.email}`, patientInfo);
      toast.success("Modifications enregistrées avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement des modifications.");
    }
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
     <a href="/gererUtilisateur">
       <i className='bx bxs-dashboard' ><FontAwesomeIcon icon={faHouse}/></i>
       <span className="text">Tableau de bord</span>
     </a>
   </li>
   <li>
     <a href="#">
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
    <main className="modification">
        <section className="edit">
            <h2 className="user">Modifier L'utilisateur :</h2>
            <form className="formulaire" onSubmit={handleFormSubmit}>
                        <label htmlFor="nom" className="champ">Nom :</label>
                        <input type="text" id="nom" name="nom" value={patientInfo.nom} onChange={handleChange} /><br></br>
                        <label htmlFor="prenom" className="champ">Prénom :</label>
                        <input type="text" id="prenom" name="prenom" value={patientInfo.prenom} onChange={handleChange} /><br></br>
                        <label htmlFor="email" className="champ">Email :</label>
                        <input type="text" id="email" name="email" value={patientInfo.email} onChange={handleChange} /><br></br>
                        <label htmlFor="telephone" className="champ">Télephone :</label>
                        <input type="text" id="telephone" name="telephone" value={patientInfo.telephone} onChange={handleChange} /><br></br>
                        <input type="submit" value="Enregistrer les modifications"/>
                    </form>
        </section>
    </main>
    </section>
    </div>

    );
}
export default Modifierutilisateur;
