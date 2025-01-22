const express = require('express');
const router = express.Router();
const User = require("../models/userModel");
const RendezVous = require("../models/rendezVousModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.get('/users', async (req, res) => {
    try {
      const utilisateurs = await User.find();
      res.status(200).json({ success: true, utilisateurs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", success: false, err });
    }
  });

  router.get('/patients', async (req, res) => {
    try {
      const patients = await User.find({typedecompte: 'Patient'});
      res.status(200).json({ success: true, patients });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur lors de la récupération des patients", success: false, err });
    }
  });
  router.get('/patients-radio', async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Recherchez les rendez-vous pour la date actuelle
      const rendezvous = await RendezVous.find({ date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }, statut: "réservé" });
      const patientsPromises = rendezvous.map(async (rdv) => {
        const patient = await User.findOne({ _id: rdv.patient });
        return patient;
    });

    const patients = await Promise.all(patientsPromises);
      res.status(200).json({ success: true, patients });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur lors de la récupération des patients", success: false, err });
    }
  });
  
  router.get('/techniciens', async (req, res) => {
    try {
      const techniciens = await User.find({typedecompte: 'Technicien en imagerie'});
      res.status(200).json({ success: true, techniciens });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur lors de la récupération des techniciens", success: false, err });
    }
  });

  
  router.get('/secretaires', async (req, res) => {
    try {
      const secretaires = await User.find({typedecompte: 'Secretaire'});
      res.status(200).json({ success: true, secretaires });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur lors de la récupération des secretaires", success: false, err });
    }
  });

  
  router.get('/radiologues', async (req, res) => {
    try {
      const radiologues = await User.find({typedecompte: 'Radiologue'});
      res.status(200).json({ success: true, radiologues });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur lors de la récupération des radiologues", success: false, err });
    }
  });

  router.get('/userByEmail/:userEmail', async (req, res) => {
    try {
      const email = req.params.userEmail;
      const user = await User.findOne({ email: email }); // Recherchez l'utilisateur par son email
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.json({ user }); // Retournez les informations de l'utilisateur
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la récupération des informations de l'utilisateur" });
    }
  });

  router.put('/updateUser/:userEmail', async (req, res) => {
    try {
      const email = req.params.userEmail;
      const updatedUser = req.body; 
  
      // Mettre à jour l'utilisateur dans la base de données
      await User.findOneAndUpdate({ email: email }, updatedUser);
  
      res.status(200).json({ message: "Informations de l'utilisateur mises à jour avec succès" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la mise à jour des informations de l'utilisateur" });
    }
  });

  router.delete('/deleteUsers/:id', async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
  });

  router.get('/search',authMiddleware, async (req, res) => {
    const { query } = req.query; // Récupérer le terme de recherche depuis la requête
  
    try {
      let users;

      // Si le query contient deux mots séparés par un espace
      if (query.includes(' ')) {
        const [nom, prenom] = query.split(' '); // Diviser le query en deux parties : nom et prenom
        users = await User.find({
          $or: [
            { nom: { $regex: nom, $options: 'i' }, prenom: { $regex: prenom, $options: 'i' } }, // Recherchez par nom et prénom
            { prenom: { $regex: nom, $options: 'i' }, nom: { $regex: prenom, $options: 'i' } } // Recherchez par prénom et nom
          ]
        });
      } else {
        // Recherchez les utilisateurs par nom complet
        users = await User.find({
          $or: [
            { nom: { $regex: query, $options: 'i' } }, // Recherchez dans le nom (insensible à la casse)
            { prenom: { $regex: query, $options: 'i' } } // Recherchez dans le prénom (insensible à la casse)
          ]
        });
      }
  
      res.status(200).json(users);
    } catch (error) {
      console.error('Erreur lors de la recherche des utilisateurs :', error);
      res.status(500).json({ message: 'Erreur lors de la recherche des utilisateurs' });
      return ;
    }
  });

  router.get('/search-patients',authMiddleware, async (req, res) => {
    const { query } = req.query; // Récupérer le terme de recherche depuis la requête
  
    try {
      let patients;

      // Si le query contient deux mots séparés par un espace
      if (query.includes(' ')) {
        const [nom, prenom] = query.split(' '); // Diviser le query en deux parties : nom et prenom
        patients = await User.find({ typedecompte: 'Patient',
          $or: [
            { nom: { $regex: nom, $options: 'i' }, prenom: { $regex: prenom, $options: 'i' } }, // Recherchez par nom et prénom
            { prenom: { $regex: nom, $options: 'i' }, nom: { $regex: prenom, $options: 'i' } } // Recherchez par prénom et nom
          ]
        });
      } else {
        // Recherchez les utilisateurs par nom complet
        patients = await User.find({ typedecompte: 'Patient',
          $or: [
            { nom: { $regex: query, $options: 'i' } }, // Recherchez dans le nom (insensible à la casse)
            { prenom: { $regex: query, $options: 'i' } } // Recherchez dans le prénom (insensible à la casse)
          ]
        });
      }
  
      res.status(200).json(patients);
    } catch (error) {
      console.error('Erreur lors de la recherche des patients :', error);
      res.status(500).json({ message: 'Erreur lors de la recherche des patients' });
      return ;
    }
  });
  module.exports = router;