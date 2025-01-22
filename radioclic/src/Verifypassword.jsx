import React, { useState, useEffect } from "react";
import "./Verifypassword.css";
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate } from "react-router-dom";

function Verifypassword() {
    const [code, setCode] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleVerifyPasswordCode = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/user/verify-password-code", { email, code });
            toast.success(response.data.message);
            navigate(`/newpassword/${email}`);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="thecontainer">
            <div className="form-container">
                <h1>Vérification du code</h1>
                <p>
                    Nous avons envoyé un code de vérification à six chiffres à votre adresse e-mail 
                </p>
                <form onSubmit={handleVerifyPasswordCode}>
                    <input type="text" name="email" placeholder="Entrez votre email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" name="code" placeholder="Entrez le code de vérification" value={code} onChange={(e) => setCode(e.target.value)} />
                    <button className="btn2" type="submit">Vérifier</button>
                </form>
                <p className="resend-link">
                    <a href="/forgotpassword">Renvoyer le code</a>
                </p>
            </div>
        </div>
    );
}
export default Verifypassword;