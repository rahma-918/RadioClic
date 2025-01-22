const express = require('express');
const router = express.Router();
const RendezVous = require("../models/rendezVousModel");

router.get('/rdv', async (req, res) => {
    try {
        const currentDate = new Date();
        const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        const rendezvous = await RendezVous.find({
            date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } // Entre aujourd'hui et demain
        });

        res.status(200).json({ success: true, rendezvous });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la récupération des rendezVous", success: false, err });
    }
});

module.exports = router;
