const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    motdepasse: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    typedecompte: {
        type: String,
        required: true
    },
    sexe: {
        type: String,
        required: false
    },
    datedenaissance: {
        type: String,
        required: false
    },
    clé_secrete: {
        type: String,
        required: false
    },
    resetPasswordCode:{
        type: Number,
        required: false
    },
    resetPasswordExpires:{
        type: Number,
        required: false
    }
},
    {
        timestamps: true
    }

)

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;