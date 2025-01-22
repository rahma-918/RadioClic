import React, {useState,useEffect} from "react";
import {useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import './CompteAdmin.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";
import { faTrash } from '@fortawesome/free-solid-svg-icons'
function CompteAdmin(){
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: ""
});

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
    const confirmDelete = () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
          toast("Votre compte a été supprimé avec succés");
            // Rediriger vers une page de confirmation ou de déconnexion
            navigate("/login");
        }
    }
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");


// Function to fetch user information
const getUserInfo = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/user-info', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error(error);
        // Handle errors
    }
};


useEffect(() => {
  getUserInfoFromBackend();
}, []);

const getUserInfoFromBackend = async () => {
  try {
    const data = await getUserInfo();
    // Only update userInfo state if data is available
    if (data) {
      setUserInfo({
        ...data,

      });
    }
  } catch (error) {
    console.error(error);
    // Handle errors
  }
};
const deleteAccount = async () => {
  try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/user/delete-account', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      confirmDelete();
  } catch (error) {
      console.error(error);
      // Gérer les erreurs
  }
};

const updateUserInformation = async () => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(userInfo.email)) {
    toast.error("Veuillez entrer une adresse email valide.");
    return;
  }

  // Vérification du format du numéro de téléphone
  const phoneRegex = /^\d{8}$/;
  if (!phoneRegex.test(userInfo.telephone)) {
    toast.error("Veuillez entrer un numéro de téléphone composé de 8 chiffres.");
    return;
  }
  try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/user/update-user-info', userInfo, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      toast.success("Informations mises à jour avec succès !");
  } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite lors de la mise à jour des informations.");
  }
};

const updatePassword = async () => {
  try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/user/update-password', { oldPassword, newPassword }, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      toast.success("Mot de passe mis à jour avec succès !");
  } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite lors de la mise à jour du mot de passe.");
  }
};



    return(
        <div>
             <section id="sidebar" className={showSidebar ? "show" : "hide"}>
 <a href="#" className="brand">
         <i className='bx bxs-smile'></i>
   <span className="text">RadioClic</span>
 </a>
 <ul className="side-menu top">
   <li>
     <a href="/gererUtilisateur">
       <i className='bx bxs-dashboard' ><FontAwesomeIcon icon={faHouse}/></i>
       <span className="text">Tableau de bord</span>
     </a>
   </li>
   <li className="active">
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
        <section id="edit_profile">
            <h2>Modifier le profil :</h2>
            <form onSubmit={(e) => {
               e.preventDefault();
               updateUserInformation();
            }}>
                <label htmlFor="nom">Nom :</label>
                <input type="text" id="nom" name="nom" value={userInfo.nom} onChange={(e) => setUserInfo({...userInfo, nom: e.target.value})} /><br></br>
                <label htmlFor="prenom">Prénom :</label>
                <input type="text" id="prenom" name="prenom" value={userInfo.prenom} onChange={(e) => setUserInfo({...userInfo, prenom: e.target.value})} /><br></br>
                <label htmlFor="email">Email :</label>
                <input type="text" id="email" name="email" value={userInfo.email} onChange={(e) => setUserInfo({...userInfo, email: e.target.value})} /><br></br>
                <label htmlFor="telephone">Télephone :</label>
                <input type="text" id="telephone" name="telephone" value={userInfo.telephone} onChange={(e) => setUserInfo({...userInfo, telephone: e.target.value})} /><br></br>
                <input type="submit" value="Mettre à jour les informations"/>
            </form>
        </section>
        <section id="change_password">
                    <h2>Modifier le mot de passe :</h2>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      updatePassword();
                   }}>
                    <label htmlFor="oldPassword">Ancien mot de passe :</label>
                   <input type="password" id="oldPassword" name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} /><br />
                   <label htmlFor="newPassword">Nouveau mot de passe :</label>
                   <input type="password" id="newPassword" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /><br />
                   <label htmlFor="confirmNewPassword">Confirmer le nouveau mot de passe :</label>
                   <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} /><br />
                  <input type="submit" value="Modifier le mot de passe" />
                        
                    </form>
                </section>
        <section id="delete_account">
                    <h2>Supprimer le compte :</h2>
                    <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
                    <button  onClick={deleteAccount}><FontAwesomeIcon icon={faTrash}/>  Supprimer le compte</button>
                </section>
    </main>
    </section>
    </div>

    );
}
export default CompteAdmin;
