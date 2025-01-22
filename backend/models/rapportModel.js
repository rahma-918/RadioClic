const mongoose = require('mongoose');

const rapportSchema = new mongoose.Schema({
    date_creation: {
        type: Date,
        required: true
    },
    dossier_medical: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DossierMedical'
    },
    contenu: {
        type: String,
        required: false 
    }
},
    {
        timestamps: true
    }
);

const rapportModel = mongoose.model("rapports", rapportSchema);
module.exports = rapportModel;