const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const DossierMedical = require ('../models/dossierMedicalModel');
const Radiologie = require ('../models/radiologieModel');
const Rapport = require ('../models/rapportModel');
const authMiddleware= require('../middlewares/authMiddleware');

router.get('/patient-info/:patientId',  async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const patientInfo = await User.findOne({_id: patientId});

        if (!patientInfo) {
            return res.status(404).json({ message: "Patient n'existe pas" });
        }

        const dossierMedicalInfo = await DossierMedical.findOne({ patient: patientId });

        if (!dossierMedicalInfo) {
            return res.status(404).json({ message: "Dossier médical n'existe pas" });
        }

        res.status(200).json({ success: true, patientInfo, dossierMedicalInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching patient information", success: false, error });
    }
});


router.get('/patient-radio/:patientId', async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const dossier = await DossierMedical.findOne({ patient: patientId });
        const radiologies = await Radiologie.find({ dossier_medical: dossier._id });

        // Convertir les données binaires en URL de données
        const radiologiesWithUrls = radiologies.map(radiologie => {
            const imageUrl = `data:${radiologie.image.contentType};base64,${radiologie.image.data.toString('base64')}`;
            return { ...radiologie.toObject(), imageUrl };
        });

        res.status(200).json({ success: true, radiologies: radiologiesWithUrls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching radiologies", success: false, error });
    }
});

router.get('/patient-rapport/:patientId', async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const dossier = await DossierMedical.findOne({ patient: patientId });
        const rapport = await Rapport.findOne({dossier_medical: dossier._id});

        res.status(200).json({ success: true, rapport });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching rapport", success: false, error });
    }
});


router.post('/update-rapport/:patientId', async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const { contenu } = req.body;
        const dossier = await DossierMedical.findOne({ patient: patientId });
        const rapport = await Rapport.findOne({ dossier_medical: dossier._id });

        rapport.contenu = contenu;
        await rapport.save();
        dossier.date_modification = new Date(); 
        await dossier.save();

        res.status(200).json({ success: true, message: "Rapport médical mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du rapport médical", success: false, error });
    }
});


module.exports = router;