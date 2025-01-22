const mongoose = require('mongoose');

const dossierMedicalSchema = new mongoose.Schema({
    code_sécurité_sociale: {
        type: String,
        required: true
    },
    date_creation: {
        type: Date,
        required: true
    },
    date_modification: {
        type: Date,
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {
        timestamps: true
    }
);

const dossierMedicalModel = mongoose.model("dossiers_medicaux", dossierMedicalSchema);
module.exports = dossierMedicalModel;
