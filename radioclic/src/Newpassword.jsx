import React, { useState } from "react";
import "./Newpassword.css";
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate , useParams} from "react-router-dom";

function Newpassword() {
    const { email } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Les mots de passe ne correspondent pas");
        }
    
        try {
            const response = await axios.post("http://localhost:5000/api/user/update-password", { email, newPassword: password });
            toast.success(response.data.message);
            navigate("/login"); // Redirige vers la page de connexion après la mise à jour du mot de passe
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="thecontainer">
            <div className="form-container">
                <h1>Nouveau mot de passe</h1>
                <p>Veuillez entrer un nouveau mot de passe pour votre compte.</p>
                <form onSubmit={handleUpdatePassword}>
                    <input type="password" name="password" placeholder="Nouveau mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" name="confirm_password" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button className="btn3" type="submit">Changer</button>
                </form>
            </div>
        </div>
    );
}

export default Newpassword;