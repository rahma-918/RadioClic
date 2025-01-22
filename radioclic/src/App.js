import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Forgotpassword from "./Forgotpassword";
import Verifypassword from "./Verifypassword";
import ImagerieTech from "./ImagerieTech";
import Newpassword from "./Newpassword";
import Homepatient from "./Homepatient";
import Comptepatient from "./Comptepatient";
import PriseRendezVous from "./PriseRendezVous";
import DossierMédicalPatient from "./DossierMédicalPatient";
import HistoriquePatient from "./Historiquepatient";
import Signup from "./Signup";
import Login from "./Login";
import GererUtilisateur from "./GererUtilisateur";
import CompteAdmin from "./CompteAdmin";
import Ajouter from "./Ajouter"
import Modifierutilisateur from "./Modifierutilisateur"
import DashboardTech from "./DashboardTech"
import CompteTech from "./CompteTech"
import DashboardRadio from "./DashboardRadio";
import CompteRadio from "./CompteRadio";
import DossierRadio from "./DossierRadio";
import RadiologiesCompletes from "./RadiologiesCompletes";
import RadiologiesCompPatient from "./RadiologiesCompPatient";
import DashboardSec from "./DashboardSec";
import CompteSec from "./CompteSec";
import Listefacture from "./Listefacture";
import Modifierfacture from "./Modifierfacture";
import Ajouterfacture from "./Ajouterfacture";
import AjouterPatient from "./AjouterPatient";
import ListePatientSec from "./ListePatientSec";
import ModifierPatient from "./ModifierPatient";
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import ProtectedRoute from "./ProtectedRoutes";


function App() { 

  return (
    <BrowserRouter>
    <Toaster position="top-center" reverseOrder={false}/>
    <Routes>
      <Route path='/forgotpassword' element={ <Forgotpassword />} />
      <Route path="/newpassword/:email" element={ <Newpassword />} />
      <Route path="/verifypassword" element={ <Verifypassword />} />
      <Route path='/comptepatient' element={<ProtectedRoute><Comptepatient /></ProtectedRoute> } />
      <Route path='/homepatient' element={<ProtectedRoute><Homepatient /></ProtectedRoute>} />
      <Route path='/priseRDV' element={<ProtectedRoute><PriseRendezVous /></ProtectedRoute>} />
      <Route path='/dossierMedical' element={<ProtectedRoute><DossierMédicalPatient /></ProtectedRoute>} />
      <Route path='/historique' element={<ProtectedRoute><HistoriquePatient /></ProtectedRoute>} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/gererUtilisateur' element={<ProtectedRoute><GererUtilisateur /></ProtectedRoute>} />
      <Route path='/ajouter' element={<ProtectedRoute><Ajouter /></ProtectedRoute>} />
      <Route path='/modifierUtilisateur/:userEmail' element={<ProtectedRoute><Modifierutilisateur /></ProtectedRoute>} />
      <Route path='/compteAdmin' element={<ProtectedRoute><CompteAdmin /></ProtectedRoute>} />
      <Route path='/dashboardTech' element={<ProtectedRoute><DashboardTech /></ProtectedRoute>} />
      <Route path='/compteTech' element={<ProtectedRoute><CompteTech /></ProtectedRoute>} />
      <Route path='/compteRadio' element={<ProtectedRoute><CompteRadio /></ProtectedRoute>} />
      <Route path='/dashboardRadio' element={<ProtectedRoute><DashboardRadio /></ProtectedRoute>} />
      <Route path='/dossierRadio/:patientId' element={<ProtectedRoute><DossierRadio /></ProtectedRoute>} />
      <Route path='/radiologiesCompletes/:patientId' element={<ProtectedRoute><RadiologiesCompletes /></ProtectedRoute>} />
      <Route path='/radiologiesCompPatient' element={<ProtectedRoute><RadiologiesCompPatient /></ProtectedRoute>} />
      <Route path='/dashboardSec' element={<ProtectedRoute><DashboardSec /></ProtectedRoute>} />
      <Route path='/compteSec' element={<ProtectedRoute><CompteSec /></ProtectedRoute>} />
      <Route path='/listeFacture/:patientId' element={<ProtectedRoute><Listefacture /></ProtectedRoute>} />
      <Route path='/modifierFacture/:factureId' element={<ProtectedRoute><Modifierfacture /></ProtectedRoute>} />
      <Route path='/ajouterFacture/:patientId' element={<ProtectedRoute><Ajouterfacture /></ProtectedRoute>} />
      <Route path='/ajouterPatient' element={<ProtectedRoute><AjouterPatient /></ProtectedRoute>} />
      <Route path='/listePatientSec' element={<ProtectedRoute><ListePatientSec /></ProtectedRoute>} />
      <Route path='/modifierPatient/:userEmail' element={<ProtectedRoute><ModifierPatient /></ProtectedRoute>} />
      <Route path='/imagerieTech/:appointmentId' element={<ProtectedRoute><ImagerieTech /></ProtectedRoute>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App