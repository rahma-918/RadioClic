const mongoose = require('mongoose');

const radiologieSchema = new mongoose.Schema({
    date_creation: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['IRM', 'Radiologie', 'Scanner'],
        required: true
    },
    technicien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dossier_medical: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DossierMedical'
    },
    rendez_vous: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RendezVous'
    },
    image: {
        data: Buffer, 
        contentType: String 
    }
},
    {
        timestamps: true
    }
);

const radiologieModel = mongoose.model("radiologies", radiologieSchema);
module.exports = radiologieModel;