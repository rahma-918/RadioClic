const express = require('express');
const router = express.Router();
const Facture = require('../models/factureModel');
const User = require('../models/userModel');
const RendezVous = require('../models/rendezVousModel');
const DossierMedical = require ('../models/dossierMedicalModel')
const authMiddleware= require('../middlewares/authMiddleware');

router.get('/patient-info/:patientId', async(req, res) => {
    try{
        const patientId= req.params.patientId;
        const patient = await User.findOne({_id: patientId});
        const rendezvous = await RendezVous.findOne({
            patient: patientId,
            date: new Date().toISOString().slice(0, 10)
        })
        res.status(200).json({
            nom_patient: patient.nom ,
            prenom: patient.prenom,
            telephone: patient.telephone,
            typederadiologie: rendezvous.typeRadiologie
        });
    } catch (error) {
        console.error('Error fetching patient info:', error);
        res.status(500).json({ message: "Erreur lors de la récupération des infos" });
    }
});

router.post('/create-facture/:patientId', async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const patient = await User.findOne({_id: patientId});
        const dossier = await DossierMedical.findOne({ patient: patientId});
        const rendezvous = await RendezVous.findOne({
            patient: patientId,
            date: new Date().toISOString().slice(0, 10)
        })
        const newFacture = new Facture({
            nom_patient: patient.nom +" "+  patient.prenom,
            telephone: patient.telephone,
            typederadiologie: rendezvous.typeRadiologie,
            date_facture: new Date().toISOString().slice(0, 10),
            dossier_medical: dossier,
            montant: req.body.montant
        });
        await newFacture.save();

        res.status(201).json({ message: "Facture créé avec succès", success: true, facture: newFacture });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la création du facture", success: false, error });
    }
});

router.get('/list-facture/:patientId', async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const dossier = await DossierMedical.findOne({patient: patientId});
        const factures= await Facture.find({dossier_medical: dossier._id}).sort({ date_facture: -1 });

        res.status(201).json({factures});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la récupération des factures", success: false, error });
    }
});

router.get('/facture-info/:factureId', async (req, res) => {
    try {
        const factureId = req.params.factureId;
        const facture = await Facture.findById(factureId);
        res.status(201).json({facture});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la récupération de la facture", success: false, error });
    }
});

router.put('/update-montant/:factureId', async (req, res) => {
    try {
        const factureId= req.params.factureId;
        const { montant } = req.body;
        const facture= await Facture.findById(factureId);
        facture.montant= montant;
        await facture.save();
        res.status(200).send({ message: "facture mis à jour avec succées", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de la mise à jour de la facture", success: false, error });
    }
});

router.delete('/delete-facture/:factureId', async (req, res) => {
    try {
        const factureId= req.params.factureId;
        await Facture.findByIdAndDelete(factureId);
        res.status(200).send({ message: "facture supprimé avec succès", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de la suppression du facture", success: false, error });
    }
});

module.exports = router;