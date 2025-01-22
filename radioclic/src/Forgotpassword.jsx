import React, { useState } from "react";
import "./Forgotpassword.css";
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate } from "react-router-dom";

function Forgotpassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:5000/api/user/forgot-password", { email });
        toast.success(response.data.message);
        navigate("/verifypassword"); // Redirige vers la page de vérification du code
    } catch (error) {
        toast.error(error.response.data.message);
    }
};



    return (
        <div className="thecontainer">
            <div className="form-container">
                <h1>Mot de passe oublié</h1>
                <p>Entrez votre adresse e-mail pour réinitialiser votre mot de passe.</p>
                <form onSubmit={handleForgotPassword}>
                    <input type="email" name="email" placeholder="Votre adresse e-mail" onChange={(e) => setEmail(e.target.value)} />
                    <button className="btn1" type="submit">Continuer</button>
                </form>
            </div>
        </div>
    );
}

export default Forgotpassword;