const express = require('express');
const router = express.Router();
const RendezVous = require('../models/rendezVousModel');
const User = require ('../models/userModel');
const Radiologie = require ('../models/radiologieModel');
const DossierMedical = require ('../models/dossierMedicalModel');
const authMiddleware= require('../middlewares/authMiddleware');
const multer = require('multer');


router.get('/creneaux-disponibles/:typeRadiologie', async (req, res) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Mettre à 00:00:00:000 pour inclure la date actuelle
  const nextDay = new Date(currentDate);
  nextDay.setDate(nextDay.getDate() + 1);// Obtenir la date du lendemain
  try {
    const typeRadiologie = req.params.typeRadiologie;
    const creneauxDisponibles = await RendezVous.find({ 
      typeRadiologie: typeRadiologie, 
      statut: "disponible", 
      date: { $gte: nextDay}
    });
    
    res.status(200).json(creneauxDisponibles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur lors de la récupération des créneaux disponibles", success: false, error });
  }
});


router.put('/creneau-reserve/:id', authMiddleware, async (req, res) => {
  try {
    const creneauId = req.params.id;
    const patientId = req.userId; // Récupérer l'ID du patient connecté à partir du token JWT
    const rendezVous = await RendezVous.findByIdAndUpdate(creneauId, { statut: "réservé", patient: patientId }, { new: true });
    res.status(200).json({ message: "Créneau réservé avec succès", success: true, rendezVous });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur lors de la réservation du créneau", success: false, error });
  }
});



router.get('/rendez-vous/technicien',authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Recherchez les rendez-vous pour la date actuelle
    const rendezvous = await RendezVous.find({ date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    technicien: req.userId,
    statut: "réservé",
   });
    const patientsPromises = rendezvous.map(async (rdv) => {
      const patient = await User.findOne({ _id: rdv.patient });
      return patient;
  });

  const patients = await Promise.all(patientsPromises);
    res.status(200).json({ success: true, patients, rendezvous });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération des rendez vous", success: false, err });
      return ;
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error });
  }
});




router.get('/rendezvous-secretaire', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Fin de la journée (minuit)
    const rendezvous = await RendezVous.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      },
      statut: "réservé"
    });
    res.status(200).json(rendezvous);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous", success: false, error });
  }
});


router.get('/rendezvous-patient-secretaire', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); 
    const rendezvous = await RendezVous.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });
    const patientIds = rendezvous.map(rendezvousItem => rendezvousItem.patient);
    const patients = await Promise.all(patientIds.map(patientId => User.findById(patientId)));
    res.status(200).json(patients);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur lors de la récupération des patients", success: false, error });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/upload/:rendezvousId', upload.single('image'), authMiddleware,  async (req, res) => {
  try {
    const technicien = req.userId;
    const rendezvousId = req.params.rendezvousId;
    const rendezvous = await RendezVous.findById(rendezvousId);
    const dossier= await DossierMedical.findOne({patient: rendezvous.patient});
    const data = req.file.buffer;
    const contentType = req.file.mimetype;
    const newImage = new Radiologie({
      date_creation: Date.now(),
      type:  rendezvous.typeRadiologie,
      technicien: technicien,
      dossier_medical: dossier._id,
      rendez_vous: rendezvousId,
      image: {
        data: data, 
        contentType: contentType
    }

    });
    await newImage.save();

    res.status(200).json({ message: "Image ajoutée avec succès", newImage });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'image" });
    return ;
  }
});

router.put('/update-image/:id', upload.single('image'), authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const updatedRadiologie = await Radiologie.findByIdAndUpdate(id, {
      image: {
        data: image.buffer,
        contentType: image.mimetype
      }
    });
    await updatedRadiologie.save();

    if (!updatedRadiologie) {
      return res.status(404).json({ success: false, message: "Radiology record not found" });
    }

    res.status(200).json({ success: true, message: "Image updated successfully", radiologie: updatedRadiologie });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ success: false, message: "Error updating image" });
  }
});

router.delete('/supprimer-radio/:imagerieId',  async (req, res) => {
  try {
      const {imagerieId}= req.params;
      await Radiologie.findByIdAndDelete(imagerieId);
          
      res.status(200).json({ message:"radiologie supprimé avec succés"});
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "erreur lors de la suppression du radiologie"});
  }
});

router.get('/check-radiologie/:appointmentId', async (req, res) =>{
  const { appointmentId } = req.params;
  try {
    const radiologie = await Radiologie.findOne({ rendez_vous: appointmentId });
    if (radiologie) {
        return res.status(200).json({ success: true, exists: true });
    } else {
        return res.status(200).json({ success: true, exists: false });
    }
} catch (error) {
    return res.status(500).json({ success: false, message: "Erreur du serveur" });
}
});

router.get('/futurs-rendezvous', authMiddleware, async (req, res) => {
  try {
    const patientId = req.userId;
    const currentDate = Date.now();

    const futursRDV = await RendezVous.find({ 
      patient: patientId,
      date: { $gt: currentDate } ,
      statut: "réservé"
    });
    
    res.status(200).json({ success: true, futursRDV });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur lors de la récupération des futurs rendez-vous", success: false, error });
  }
});





module.exports = router;