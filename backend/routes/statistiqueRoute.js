const express = require('express');
const router = express.Router();
const axios = require('axios');
const RendezVous = require('../models/rendezVousModel');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');
const Radiologie = require('../models/radiologieModel');
const DossierMedical = require('../models/dossierMedicalModel');
const Facture = require('../models/factureModel');

router.get('/rendez-vous/count',authMiddleware, async (req, res) => {
    try {
        const count = await RendezVous.countDocuments({
            patient: req.userId, 
        });

        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre de rendez-vous", success: false, error });
    }
});

router.get('/patients/count', async (req, res) => {
    try {
        const count = await User.countDocuments({
            typedecompte: "Patient"
        });
        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre de rendez-vous", success: false, error });
    }
});

router.get('/techniciens/count', async (req, res) => {
    try {
        const count = await User.countDocuments({
            typedecompte: "Technicien en imagerie"
        });
        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre des techniciens", success: false, error });
    }
});

router.get('/secretaires/count', async (req, res) => {
    try {
        const count = await User.countDocuments({
            typedecompte: "Secretaire"
        });
        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre de rendez-vous", success: false, error });
    }
});

router.get('/radiologues/count', async (req, res) => {
    try {
        const count = await User.countDocuments({
            typedecompte: "Radiologue"
        });
        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre de rendez-vous", success: false, error });
    }
});

router.get('/rendez-vous-secretaire/count', async (req, res) => {
    try {
        const count = await RendezVous.countDocuments({
            date: new Date().toISOString().slice(0, 10) ,
            statut: "réservé"
        });

        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre de rendez-vous", success: false, error });
    }
});

router.get('/rendez-vous-technicien/count',authMiddleware, async (req, res) => {
    try {
        const technicien= req.userId;
        const count = await RendezVous.countDocuments({
            date: new Date().toISOString().slice(0, 10) ,
            statut: "réservé",
            technicien: technicien
            
        });

        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre de rendez-vous", success: false, error });
        return ;
    }
});


router.get('/rendez-vous-accompli/count', authMiddleware, async (req, res) => {
    try {
        const technicien = req.userId;
        const appointments = await RendezVous.find({
            date: new Date().toISOString().slice(0, 10),
            statut: "réservé",
            technicien: technicien
        });
        let count = 0;
        for (const appointment of appointments) {
            const response = await axios.get(`http://localhost:5000/api/rendez-vous/check-radiologie/${appointment._id}`);
            if (response.data.success && response.data.exists) {
                count++;
            }
        }
        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre de rendez-vous accomplis", success: false, error });
    }
});

router.get('/rendez-vous-en-attente/count', authMiddleware, async (req, res) => {
    try {
        const technicien = req.userId;
        const appointments = await RendezVous.find({
            date: new Date().toISOString().slice(0, 10),
            statut: "réservé",
            technicien: technicien
        });
        let count = 0;
        for (const appointment of appointments) {
            const response = await axios.get(`http://localhost:5000/api/rendez-vous/check-radiologie/${appointment._id}`);
            if (response.data.success && !response.data.exists) {
                count++;
            }
        }
        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre de rendez-vous", success: false, error });
    }
});

router.get('/IRM/count', async (req, res) => {
    try {
        const count = await RendezVous.countDocuments({
            date: new Date().toISOString().slice(0, 10) ,
            statut: "réservé",
            typeRadiologie: "IRM"
        });

        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre des IRM", success: false, error });
    }
});

router.get('/scanner/count', async (req, res) => {
    try {
        const count = await RendezVous.countDocuments({
            date: new Date().toISOString().slice(0, 10) ,
            statut: "réservé",
            typeRadiologie: "Scanner"
        });

        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre des scanners", success: false, error });
    }
});

router.get('/radiographie/count', async (req, res) => {
    try {
        const count = await RendezVous.countDocuments({
            date: new Date().toISOString().slice(0, 10) ,
            statut: "réservé",
            typeRadiologie: "Radiologie"
        });

        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre des radiographies", success: false, error });
    }
});

router.get('/radiologies/count',authMiddleware, async (req, res) => {
    try {
        const patient= req.userId;
        const dossier = await DossierMedical.findOne({ patient: patient });
        const count = await Radiologie.countDocuments({
            dossier_medical: dossier._id, 
        });

        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre des radiologies", success: false, error });
    }
});

const moment = require('moment');

router.get('/factures-secretaire/sum', async (req, res) => {
    try {
        const today = moment().startOf('day'); // Obtient le début de la journée courante
        const tomorrow = moment(today).add(1, 'days'); // Obtient le début de la journée suivante

        const result = await Facture.aggregate([
            {
                $match: {
                    date_facture: {
                        $gte: today.toDate(), // A partir de la date de début de la journée courante
                        $lt: tomorrow.toDate() // Avant la date de début de la journée suivante
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$montant" }
                }
            }
        ]);

        const sum = result.length > 0 ? result[0].total : 0;

        res.status(200).json({ success: true, sum });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du total des frais payés", success: false, error });
    }
});


router.get('/factures/sum', authMiddleware, async (req, res) => {
    try {
        const patient = req.userId;

        const dossier = await DossierMedical.findOne({ patient: patient });

        const result = await Facture.aggregate([
            {
                $match: {
                    dossier_medical: dossier._id,
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$montant" }
                }
            }
        ]);

        const sum = result.length > 0 ? result[0].total : 0;

        res.status(200).json({ success: true, sum });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du total des frais payés", success: false, error });
    }
});




module.exports = router;
