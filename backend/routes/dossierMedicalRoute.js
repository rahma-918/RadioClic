const express = require('express');
const router = express.Router();
const  DossierMedical = require('../models/dossierMedicalModel');
const User = require('../models/userModel');
const Radiologie = require('../models/radiologieModel');
const Rapport = require('../models/rapportModel');
const Facture = require('../models/factureModel');
const pdf = require('html-pdf');
const authMiddleware= require('../middlewares/authMiddleware');
const RendezVous = require('../models/rendezVousModel');

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

router.get('/rapports/:id/telecharger', async (req, res) => {
    try {
        const rapportId = req.params.id;
        // Récupérer le rapport médical depuis la base de données
        const rapport = await Rapport.findById(rapportId);
        const dossier = await DossierMedical.findById(rapport.dossier_medical);
        const patient = await User.findById(dossier.patient);

        // Générer le contenu HTML du rapport médical
        const htmlContent = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .header h1 {
                    font-size: 24px;
                    margin: 0;
                }
                .date {
                    text-align: right;
                    font-size: 12px;
                    margin-bottom: 20px;
                }
                .patient-info, .results {
                    margin-bottom: 20px;
                }
                .patient-info p, .results p {
                    margin: 5px 0;
                }
                .section-title {
                    font-size: 18px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Rapport Médical - Examen Radiologique</h1>
            </div>
            <div class="date">
                <p>Date de création du rapport : ${formatDate(rapport.date_creation)}</p>
            </div>
            <div class="patient-info">
                <div class="section-title">Informations du Patient</div>
                <p><strong>Nom:</strong> ${patient.nom}</p>
                <p><strong>Prénom:</strong> ${patient.prenom}</p>
                <p><strong>Date de naissance:</strong> ${formatDate(patient.datedenaissance)}</p>
                <p><strong>Téléphone:</strong> ${patient.telephone}</p>
                <p><strong>Numéro de sécurité sociale:</strong> ${dossier.code_sécurité_sociale}</p>
            </div>
            <div class="results">
                <div class="section-title">Résultats</div>
                <p>${rapport.contenu.replace(/\n/g, '<br>')}</p>
            </div>
        </body>
        </html>`;

        // Options pour la génération du PDF
        const options = { format: 'Letter' };

        // Convertir le contenu HTML en PDF
        pdf.create(htmlContent, options).toStream((err, stream) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erreur lors de la génération du PDF' });
            }
            // Télécharger le PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="rapport_medical_${rapportId}.pdf"`);
            stream.pipe(res);
        });
    } catch (error) {
        console.error('Erreur lors du téléchargement du rapport médical :', error);
        res.status(500).json({ success: false, message: 'Erreur lors du téléchargement du rapport médical' });
    }
});

router.get('/telecharger-pdf/:factureId', async (req, res) => {
    try {
        const factureId = req.params.factureId;
        // Récupérer la facture depuis la base de données
        const facture = await Facture.findById(factureId);

        // Générer le contenu HTML de la facture
        const htmlContent = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .header h1 {
                    font-size: 24px;
                    margin: 0;
                }
                .date {
                    text-align: right;
                    font-size: 12px;
                    margin-bottom: 20px;
                }
                .patient-info, .details {
                    margin-bottom: 20px;
                }
                .patient-info p, .details p {
                    margin: 5px 0;
                }
                .section-title {
                    font-size: 25px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                }
                .total {
                    font-size: 20px;
                    text-align: right;
                    margin-top: 20px;
                }
                .footer {
                    font-size: 16px;
                    text-align: center;
                    margin-top: 40px;
                    font-style: italic;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Facture - Examen Radiologique</h1>
            </div>
            <div class="date">
                <p>Date de la facture : ${formatDate(facture.date_facture)}</p>
            </div>
            <div class="patient-info">
                <div class="section-title">Informations du Patient</div>
                <p><strong>Nom complet:</strong> ${facture.nom_patient}</p>
                <p><strong>Téléphone:</strong> ${facture.telephone}</p>
            </div>
            <div class="details">
                <div class="section-title">Détails de l'Examen Médical</div>
                <p><strong>Type d'examen:</strong> ${facture.typederadiologie}</p>
                <p><strong>Montant payé:</strong> ${facture.montant} dt</p>
            </div>
            <div class="total">
                <p><strong>Total:</strong> ${facture.montant} dt</p>
            </div>
            <div class="footer">
                <p>Merci pour votre confiance.</p>
            </div>
        </body>
        </html>`;

        // Options pour la génération du PDF
        const options = { format: 'Letter' };

        // Convertir le contenu HTML en PDF
        pdf.create(htmlContent, options).toStream((err, stream) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erreur lors de la génération du PDF' });
            }
            // Télécharger le PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="facture_${factureId}.pdf"`);
            stream.pipe(res);
        });
    } catch (error) {
        console.error('Erreur lors de la génération du PDF de la facture:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la génération du PDF de la facture' });
    }
});

router.post('/create-medical-record/:id', async (req, res) => {
    try {
        const patientId = req.params.id;
        const codeSecuriteSociale = generateCodeSecuriteSociale(); // Générer le code de sécurité sociale
        const newDossierMedical = new DossierMedical({
            code_sécurité_sociale: codeSecuriteSociale,
            date_creation: Date.now(),
            date_modification: Date.now(),
            patient: patientId
        });
        await newDossierMedical.save();

        res.status(201).json({ message: "Dossier médical créé avec succès", success: true, dossierMedical: newDossierMedical });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la création du dossier médical", success: false, error });
    }
});



function generateCodeSecuriteSociale() {
    // Générer un nombre aléatoire de 10 chiffres
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

router.post('/create-report/:id',async (req, res) => {
    try {
        const userId = req.params.id;
        const dossierMedical = await DossierMedical.findOne({ patient: userId });

        if (!dossierMedical) {
            return res.status(404).json({ message: "Dossier médical not found for this patient" });
        }

        // Création du rapport médical
        const newRapport = new Rapport({
            date_creation: Date.now(),
            dossier_medical: dossierMedical._id,
            contenu: ""
        });

        await newRapport.save();

        res.status(201).json({ message: "Rapport médical créé avec succès", success: true, rapport: newRapport });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création du rapport médical", success: false, error });
    }
});

router.get('/patient-info', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const patientInfo = await User.findById(userId);

        if (!patientInfo) {
            return res.status(404).json({ message: "Patient n'existe pas" });
        }

        const dossierMedicalInfo = await DossierMedical.findOne({ patient: userId });

        if (!dossierMedicalInfo) {
            return res.status(404).json({ message: "Dossier médical n'existe pas" });
        }

        res.status(200).json({ success: true, patientInfo, dossierMedicalInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching patient information", success: false, error });
    }
});

router.get('/radiologies', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const dossier = await DossierMedical.findOne({ patient: userId });
        const radiologies = await Radiologie.find({ dossier_medical: dossier._id });

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

router.get('/radiologie/:appointmentId',  async (req, res) => {
    try {
        const appointmentId= req.params.appointmentId;
        const radiology= await Radiologie.findOne({rendez_vous: appointmentId});
        const imageUrl = `data:${radiology.image.contentType};base64,${radiology.image.data.toString('base64')}`;
        const radiologieWithUrl = { ...radiology.toObject(), imageUrl }
            

        res.status(200).json({ success: true, radiologie: radiologieWithUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching radiology", success: false, error });
    }
});

router.get('/radio-info/:appointmentId',  async (req, res) => {
    try {
        const appointmentId= req.params.appointmentId;
        const rendezVous = await RendezVous.findOne({_id: appointmentId});
        const radiologie= await Radiologie.findOne({rendez_vous: appointmentId});
        const technicien= await User.findOne({_id: radiologie.technicien});
            
        res.status(200).json({ success: true, radiologie, rendezVous, technicien });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching info", success: false, error });
    }
});


router.get('/factures', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const dossier = await DossierMedical.findOne({ patient: userId });

        // Récupérer les factures triées par date décroissante
        const factures = await Facture.find({ dossier_medical: dossier._id }).sort({ date_facture: -1 });

        res.status(200).json({ success: true, factures });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching factures", success: false, error });
    }
});


router.get('/medical-reports', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const dossier = await DossierMedical.findOne({ patient: userId });
        const medicalReports = await Rapport.find({ dossier_medical: dossier._id });

        res.status(200).json({ success: true, medicalReports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching medical reports", success: false, error });
    }
});

router.get('/dossier-modification/:patientId', async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const dossier = await DossierMedical.findOne({ patient: patientId });

        if (!dossier) {
            return res.status(404).json({ success: false, message: 'Dossier médical non trouvé' });
        }

        res.status(200).json({ success: true, date_modification: dossier.date_modification });
    } catch (error) {
        console.error('Erreur lors de la récupération de la date de modification du dossier médical:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la date de modification du dossier médical' });
    }
});

module.exports = router;
