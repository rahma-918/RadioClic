const express = require('express');
const router = express.Router();
const RendezVous = require('../models/rendezVousModel');
const authMiddleware =require('../middlewares/authMiddleware');

// Route pour récupérer les rendez-vous d'un patient spécifique
router.get('/historique-patient', authMiddleware, async (req, res) => {
  const currentDate = Date.now();
  try {
    const userId = req.userId;
    const rendezVous = await RendezVous.find({ patient: userId, date: { $lte: currentDate } }).sort({ date: -1 });
    res.status(200).json({ success: true, rendezVous  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous du patient' , success: false, err});
  }
});

router.delete('/delete-rendezvous/:id', authMiddleware, async (req, res) => {
  try {
    const rendezVousId = req.params.id;
    const userId = req.userId;
    const rendezVous = await RendezVous.findOne({ _id: rendezVousId, patient: userId });
    if (!rendezVous) {
      return res.status(404).json({ success: false, message: "Rendez-vous non trouvé" });
    }
    await RendezVous.findByIdAndDelete(rendezVousId);
    res.status(200).json({ success: true, message: "Rendez-vous supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression du rendez-vous', err });
  }
});

router.put('/annuler-rendezvous/:id', authMiddleware, async (req, res) => {
  try {
    const rendezVousId = req.params.id;
    const rendezVous = await RendezVous.findById(rendezVousId);
    if (!rendezVous) {
      return res.status(404).json({ success: false, message: "Rendez-vous non trouvé" });
    }
    if (rendezVous.statut !== 'réservé') {
      return res.status(400).json({ success: false, message: "Le rendez-vous n'est pas en attente" });
    }
    rendezVous.patient = undefined; // Supprimer l'ID du patient
    rendezVous.statut = 'disponible'; // Mettre le statut à disponible
    await rendezVous.save();
    res.status(200).json({ success: true, message: "Rendez-vous annulé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur lors de l'annulation du rendez-vous", err });
  }
});

module.exports = router;

