const express = require('express');
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
router.post('/signup', async (req, res) => {
    try {
        if (!/^[\w-]+(\.[\w-]+)*@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(req.body.email)) {
            return res.status(400).send({ message: "Veuillez saisir une adresse e-mail valide", success: false });
          }
      
          // Validation du numéro de téléphone
          if (!/^\d{8}$/.test(req.body.telephone)) {
            return res.status(400).send({ message: "Le numéro de téléphone doit contenir 8 chiffres", success: false });
          }
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).send({ message: "utilisateur déjà existe", success: false })
        }

        if (req.body.typedecompte === "Admin") {
            const secretKey = req.body.clé_secrete;
            if (secretKey !== process.env.JWT_SECRET) {
                return res.status(400).send({ message: "Clé secrète invalide pour admin", success: false });
            }
        }
        const motdepasse = req.body.motdepasse;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motdepasse, salt);
        req.body.motdepasse = hashedPassword;
        const newuser = new User(req.body);
        await newuser.save();
        res.status(200).send({ message: "compte crée avec succés", success: true, userId: newuser._id });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "erreur compte non crée", success: false, error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: "Utilisateur n'existe pas", success: false });
        }
        const isMatch = await bcrypt.compare(req.body.motdepasse, user.motdepasse);
        if (!isMatch) {
            return res.status(200).send({ message: "Mot de passe incorrect", success: false });
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            // Redirection en fonction du type de compte
            let redirectUrl = "/homepatient"; // Défaut
            switch (user.typedecompte) {
                case "Admin":
                    redirectUrl = "/gererUtilisateur";
                    break;
                case "Technicien en imagerie":
                    redirectUrl = "/dashboardTech";
                    break;
                case "Radiologue":
                    redirectUrl = "/dashboardRadio";
                    break;
                case "Secretaire":
                    redirectUrl = "/dashboardSec";
                    break;
            }

            res.status(200).send({
                message: "Connexion réussie",
                success: true,
                data: token,
                redirect: redirectUrl
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Erreur de connexion", success: false, error });
        return ;
    }
});



router.post('/get-user-info-by-id', authMiddleware , async(req,res) =>{
    try{
        const user = await User.findOne({_id: req.userId});
        if (!user){
            return res
            .status(200)
            .send({message: "Utilisateur n'existe pas", success: false});
        }else{
            res.status(200).send({ success:true , data: {
                nom: user.nom,
                email:user.email,
            }})
        }
    } catch (error){
        res.status(500).send({message: "erreur lors de l'obtention des informations de l'utilisateur", success: false, error});

    }
});



router.get('/user-info', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        if (!user) {
            return res.status(404).send({ message: "User not found", success: false });
        }
        res.status(200).send({ message: "User information retrieved successfully", success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching user information", success: false, error });
    }
});

router.delete('/delete-account', authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.userId);
        res.status(200).send({ message: "Compte utilisateur supprimé avec succès", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de la suppression du compte utilisateur", success: false, error });
    }
});

router.put('/update-user-info', authMiddleware, async (req, res) => {
    try {
        const { nom, prenom, email, datedenaissance, telephone } = req.body;
        // Find the user by ID
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({ message: "User not found", success: false });
        }
        // Update user information
        user.nom = nom;
        user.prenom = prenom;
        user.email = email;
        user.datedenaissance = datedenaissance;
        user.telephone = telephone;
        // Save the updated user information
        await user.save();
        res.status(200).send({ message: "User information updated successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error updating user information", success: false, error });
    }
});

router.get('/compte-info', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        res.status(200).send({ message: "Utilisateur récupéré avec succès", success: true, user });
    } catch (error) { // Ajoutez le paramètre d'erreur ici
        console.error(error);
        res.status(500).send({ message: "Erreur lors de la récupération de l'utilisateur", success: false, error }); 
        return ;
    }
});

router.put('/update-password', authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        // Trouver l'utilisateur par ID
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({ message: "Utilisateur non trouvé", success: false });
        }
        // Vérifier si l'ancien mot de passe est correct
        const isMatch = await bcrypt.compare(oldPassword, user.motdepasse);
        if (!isMatch) {
            return res.status(400).send({ message: "Ancien mot de passe incorrect", success: false });
        }
        // Crypter le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        // Mettre à jour le mot de passe de l'utilisateur
        user.motdepasse = hashedPassword;
        // Enregistrer les modifications dans la base de données
        await user.save();
        res.status(200).send({ message: "Mot de passe mis à jour avec succès", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de la mise à jour du mot de passe", success: false, error });
    }
});


router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ message: "Utilisateur non trouvé", success: false });
        }
        
        const resetCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit verification code
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpires = Date.now() + 3600000; // Code expires in 1 hour
        await user.save();

        // Send the verification code via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Réinitialisation de mot de passe',
            text: `Votre code de vérification pour réinitialiser votre mot de passe est : ${resetCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send({ message: "Erreur lors de l'envoi de l'e-mail de réinitialisation", success: false });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).send({ message: "Code de vérification envoyé avec succès", success: true });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de la réinitialisation du mot de passe", success: false, error });
    }
});

router.post('/verify-password-code', async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).send({ message: "Utilisateur non trouvé", success: false });
        }

        if (user.resetPasswordCode !== parseInt(code)) {
            return res.status(400).send({ message: "Code de vérification incorrect", success: false });
        }

        // Si les codes correspondent, redirigez l'utilisateur vers la page de réinitialisation du mot de passe
        return res.status(200).send({ message: "Code de vérification correct", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de la vérification du code de réinitialisation", success: false, error });
    }
});

router.post("/update-password", async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      // Recherche de l'utilisateur par son e-mail
      const user = await User.findOne({ email });
  
      // Vérification de l'utilisateur
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
  
      // Hachage du nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Mise à jour du mot de passe dans la base de données
      user.motdepasse = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
      return res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe." });
    }
  });



module.exports = router;