import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import "./DossierRadio.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faFloppyDisk, faDownload} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { faBars, faEnvelope,faPhone,faRightFromBracket,faTimes } from '@fortawesome/free-solid-svg-icons'
import User from "../src/assets/user.jpg";


function DossierRadio() {
  const { patientId } = useParams();
  const [patientInfo, setPatientInfo] = useState({});
  const [dossierMedicalInfo, setDossierMedicalInfo] = useState({});
  const [radiologies, setRadiologies] = useState([]);
  const [rapport, setRapport] = useState({ contenu: "" });
  const [user, setUser] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();
  const [showProfileInfo, setShowProfileInfo] = useState(false);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar); // Inverse l'état actuel du sidebar
  };

  const handleProfileClick = () => {
    setShowProfileInfo(!showProfileInfo);
  };

  const corpus=` 
  Le système ventriculaire est médian non dilaté.
  Absence d'hématome extra-axial.
  Stabilité du bilan lésionnel osseux anciennemnt décrit.
  1/Etage cérébral:
  Hématome intra parenchymateux lobaire frontal droit entouré de l'oédème mesurant 29,5*27 mm.
  Les citernes de la base sont libres.
  Pas de saignement  péri-cérébral.
  Pas de collection sous ou extra durale.
  Légere atrophie cortico-sous-corticale cérébrale globale.
  Leucoariose.
  2/Etage thoracique:
  Pas d'adénomégalie médiastino-hilaire de taille significative décelable.
  Dilatation des oreillettes cardiaques plus marquéeà droite.
  Ectasie de l'aorte ascendante mesurant 42 mm de diamètre.
  Dilatation du tronc de l'artère pulmonaire de 33 mm de diamètre.
  Pas d'épanchement pleural ou péricardique.
  Condensation parenchymateuse avec bronchectasies au niveau du lobe moyen.
  Des atélectasies en bandes intéressant le segment Fowler droit ,le segment ventral du LSD et en bi-basal.
  Status post-opératoire avec craniectomie frontale.
  Pneumoencéphalie frontale antérieure bilatérale.
  Lame d'hémorragie extra axiale fronto-pariéto-temporale droite de 5 mm d'épaisseur.
  Présence d'une lésion kystique ovalaire à paroi calcifiée par endroits au nivea du lobe frontal  en para sagital gauche communicant avec le VL homolatéral et  mesurant 30*29 mm.Elle est le siège d'une hyperdensité hémorragique centrale de taille centimétrique.
  Deux trajets  linéaires(para sagital et diagonal)  et hypodenses intra parenchymateux  fontaux antérieurs gauches  arrivant au contact de lésion kystique sus décrite.Ce sdeux tajets renfermant deux hématomes mesurant respectivement 5 mm et 8*19 mm.
  Les structures médianes sont en place.
  Le système ventriculaire est médian.
  Collection liquidienne sous cutanée fronto-pariétale gauche.
  Voir CR Numéro 202158335.
  Examen comparé à celui du 19/10/2021:
  Volet de craniotomie frontale gauche avec présence d'une plage hypodense du parenchyme frontale en regard en rapport avec un foyer de contusion cérébal.
  Collection des parties molles en regard du volet à contenu liquidien et aérique de 43mm.
  Disparition de la composante hémorragique du foyer de contusion basifrontal droite avec majoration de la composante oedemetause.
  Stabilité radiologique par ailleurs.
  Hématome capsulo thalamique gauche entouré par un halo d'odéme péri lésionnel mesurant en axial 27*24mm et étendu sur 28mm de hauteur.
  Inondation triventriculaire .
  Absence d'hydrocéphalie.
  Absence de thrombose veineuse cérébrale.
  Absence d'anomalie sur la SRM.
  Méga-grande citerne.
  Sur la perfusion , il présente une hyperperfusion avec un rCBV à 9.5.
  Lésion intra axiale corticale frontale droite, de 24 mm du grand axe en hypersignal FLAIR, isosignal T1, sans restriction de l'ADC ni prise de contraste.
  PAROTIDE ++++
  Absence de stigmate d'hémorragie.
  Une ovalaire du genu du corps calleux de 7 mm.
  Comblement total du sinus frontal et ethmoïdale gauche.
  Une périventriculaire en regard de la corne frontale du VL droit de 6 mm.
  Formation kystique de la glande pineale  de 9 mm.
  Début d'engogement temporal droit.
  Processus expansif tissulaire intra-cranien et extra-axial basi-frontal droit de 52 x 43 x 36 mm avec une base d'implantation sur le clinoïde antérieur et la petite aile de sphénoïde rehaussé intensement associée à une rehaussement pachyméningé "dural tail sign"
  Il est  en iso-signal T1, hypersignal T2, FLAIR et diffusion avec discrète restriction de l'ADC contenant des zones en hyposignal en rapport avec des calcifications. 
`;
  
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

  const handleDownloadReport = async (reportId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/dossier-medical/rapports/${reportId}/telecharger`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob', // Important: Indiquer que la réponse est de type blob (fichier)
        });
        
        toast.success("rapport téléchargé avec succés");
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `rapport_medical_${reportId}.pdf`);
        document.body.appendChild(link);
        link.click();
        
    } catch (error) {
        toast.error("Erreur lors du téléchargement du rapport médical :", error);
    }
};

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/dossierRadio/patient-info/${patientId}`);
        console.log(response.data);
        setPatientInfo(response.data.patientInfo);
        setDossierMedicalInfo(response.data.dossierMedicalInfo);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations du patient:', error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  useEffect(() => {
    const fetchRadiologies = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/dossierRadio/patient-radio/${patientId}`);
        if (response.data.success) {
          const sortedRadiologies = response.data.radiologies.sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation));
          const recentRadiologies = sortedRadiologies.slice(0, 3);
          setRadiologies(recentRadiologies);
      } else {
          console.error(response.data.message);
      }
      } catch (error) {
        console.error('Erreur lors de la récupération des radiologies:', error);
      }
    };

    fetchRadiologies();
  }, [patientId]);

  useEffect(() => {
    const fetchRapport = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/dossierRadio/patient-rapport/${patientId}`);
        console.log(response.data);
        setRapport(response.data.rapport);
      } catch (error) {
        console.error('Erreur lors de la récupération des rapport:', error);
      }
    };

    fetchRapport();
  }, [patientId]);

  const handleSaveRapport = async () => {
    try {
      await axios.post(`http://localhost:5000/api/dossierRadio/update-rapport/${patientId}`, {
        contenu: rapport.contenu,
      });
      toast.success("Rapport médical mis à jour avec succès !");
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rapport médical:', error);
      toast.error("Erreur lors de la mise à jour du rapport médical");
    }
  };

  useEffect(() => {
    const inputElement = document.getElementById('sentenceInput');
    const autocompleteList = document.getElementById('autocomplete-list');
  
    function loadCorpus(callback) {
      const corpusLines = corpus.split('\n').map(line => line.trim()).filter(line => line !== '');
      callback(corpusLines);
    }
  
    loadCorpus(function (corpus) {
      function autocomplete() {
        const inputValue = inputElement.value.toLowerCase();
        const rows = inputValue.split('\n');
        const lastRow = rows[rows.length - 1];
        const suggestions = corpus.filter(word => word.toLowerCase().startsWith(lastRow.toLowerCase()));
  
        autocompleteList.innerHTML = '';
        suggestions.forEach(suggestion => {
          const suggestionElement = document.createElement('div');
          suggestionElement.innerText = suggestion;
          suggestionElement.addEventListener('click', () => {
            const newRows = inputValue.split('\n');
            newRows[newRows.length - 1] = suggestion;
            const updatedContent = newRows.join('\n') + '\n'; // Ajout d'un retour à la ligne
            inputElement.value = updatedContent;
            setRapport((prevRapport) => ({ ...prevRapport, contenu: updatedContent }));
            autocompleteList.innerHTML = ''; // Effacer les suggestions après sélection
        });
        
          autocompleteList.appendChild(suggestionElement);
        });
      }
  
      inputElement.addEventListener('input', autocomplete);
    });
  }, []);
  
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
        <main>
          <section id="profil">
            <h2>Profil du patient</h2>
            <div>
              <p><strong>Nom :</strong>{patientInfo.nom} {patientInfo.prenom}</p>
              <p><strong>Date de naissance :</strong>{formatDate(patientInfo.datedenaissance)}</p>
              <p><strong>Numéro de sécurité sociale :</strong> {dossierMedicalInfo.code_sécurité_sociale}</p>
              <p><strong>Sexe :</strong>{patientInfo.sexe} </p>
              <p><strong>Téléphone :</strong>{patientInfo.telephone}</p>
              <p><strong>E-mail :</strong>{patientInfo.email}</p>
            </div>
          </section>
          <section id="radiologies">
            <h2>Radiographies</h2>
            <div className="cadre-images">
                  <div className="liste-radiologie">
                  {radiologies.map(radiologie => (
                    <div className="radiologie">
                        <img 
                            key={radiologie._id}
                            src={radiologie.imageUrl}
                            alt={`Radiographie ${radiologie.type}`}
                            title={`Date: ${formatDate(radiologie.date_creation)}, Type: ${radiologie.type}`}
                            style={{ width: "250px", height: "250px" }}
                        />
                        <p>Date: {formatDate(radiologie.date_creation)}</p>
                        <p>Type: {radiologie.type}</p>

                        </div>
                    ))}
                  </div>
                </div>
            <Link to={`/radiologiesCompletes/${patientId}`}>Voir la liste des radiographies</Link>

          </section>
          <section id="rapportMedical">
            <h2>Rapport Radiologique</h2>
            <div>
          <textarea
          id="sentenceInput"
            placeholder="Le rapport est actuellement vide..."
            value={rapport.contenu}
            onChange={(e) => setRapport({ ...rapport, contenu: e.target.value })}
          ></textarea>
          <div id="autocomplete-list"></div>
          <div className="button-container">
            <button className="enregistrer-btn" title="enregistrer les modifications apportés sur le rapport" onClick={handleSaveRapport} >
            <FontAwesomeIcon icon={faFloppyDisk}/>  Enregistrer
            </button>
            <button className="enregistrer-btn" title="télécharger le rapport en format pdf" onClick={() => handleDownloadReport(rapport._id)}>
            <FontAwesomeIcon icon={faDownload}/>Télécharger
            </button>
          </div>
        </div>
          </section>
          </main>
      </section>
      
    </div>
    
  );
}

export default DossierRadio;
