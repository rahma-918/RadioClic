const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const userRoute = require("./routes/userRoute");
const rendezVousRoute = require("./routes/rendezVousRoute");
const dossierMedicalRoute= require("./routes/dossierMedicalRoute");
const historiqueRoute = require("./routes/historiqueRoute");
const statistiqueRoute = require("./routes/statistiqueRoute");
const userListRoute = require("./routes/userListRoute");
const dossierRadioRoute = require ("./routes/dossierRadioRoute");
const facturesRoute = require ("./routes/factureRoute");

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // Autoriser les cookies
}));

app.use("/api/user", userRoute);
app.use("/api/rendez-vous" , rendezVousRoute);
app.use("/api/dossier-medical" , dossierMedicalRoute);
app.use("/api/historique" , historiqueRoute);
app.use("/api/statistique", statistiqueRoute);
app.use("/api/userList", userListRoute);
app.use("/api/dossierRadio", dossierRadioRoute);
app.use("/api/factures", facturesRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
