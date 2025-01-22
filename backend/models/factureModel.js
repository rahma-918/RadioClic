const mongoose = require('mongoose');

const factureSchema = new mongoose.Schema({
    nom_patient:{
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    typederadiologie: {
        type: String,
        required: true
    },
    date_facture: {
        type: Date,
        required: true
    },
    dossier_medical: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DossierMedical'
    },
    montant: {
        type: Number,
        required: false 
    }
},
    {
        timestamps: true
    }
);

const factureModel = mongoose.model("factures", factureSchema);
module.exports = factureModel;