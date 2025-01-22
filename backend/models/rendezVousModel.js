const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    heure: {
        type: String,
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    technicien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    typeRadiologie: {
        type: String,
        required: true
    },
    statut: {
        type: String,
        enum: ['disponible', 'réservé'],
        default: 'disponible'
    }
}, { timestamps: true });



const RendezVous = mongoose.model('RendezVous', rendezVousSchema);

module.exports = RendezVous