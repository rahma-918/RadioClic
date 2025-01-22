import React, { useState, useEffect } from "react";
import image from './assets/image.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope,faLock} from '@fortawesome/free-solid-svg-icons';
import { Form, Input, Button} from "antd";
import './Login.css';
import axios from "axios";
import {useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
function Login(){
  const [showPassword, setShowPassword] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    // Supprimer le token lorsque l'utilisateur est redirigé vers la page de login
    localStorage.removeItem("token");
  }, []);

  const validateEmail = (_, value) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!emailRegex.test(value)) {
      return Promise.reject(new Error("saisir une adresse email valide"));
    }
    return Promise.resolve();
  };

  const navigate = useNavigate();
  const onFinish = async () => {
    try {
        const values = await form.validateFields();
        const response = await axios.post(
            "http://localhost:5000/api/user/login",
            values
        );
        if (response.data.success) {
            toast.success(response.data.message);
            localStorage.setItem("token", response.data.data);
            navigate(response.data.redirect);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error("Quelque chose s'est mal passé");
    }
};

  return(
    <div className="all">
      <div className="containers">
      <Form onFinish={onFinish} className="formulaire" form={form}>
       <div className="form-content">
       <div className="login-form">
          <div className="titre">RadioClic</div>
          <div className="input-boxes">
            <div className="input-box">
              <i><FontAwesomeIcon className="icones" icon={faEnvelope}/></i>
              <Form.Item name="email"  rules={[{ validator: validateEmail }]}>
                  <Input placeholder="Entrer votre email" className="input" required/>
              </Form.Item>  
            </div>
            <div className="input-box">
              <i><FontAwesomeIcon className="icones" icon={faLock}/></i>
              <Form.Item name="motdepasse">
                  <Input placeholder="Entrer votre mot de passe" type={showPassword ? "text" : "password"} className="input" required/>
              </Form.Item>
            </div>
            <div className="texte"><a className="lien1" href="/forgotpassword">Mot de passe oublié ?</a></div>
            <div className="button-input-box">
            <Button htmlType="submit" className="firstbtn">Connexion</Button>   
            </div>
            <div className="texte">
              <p>Vous n'avez pas encore de compte ?</p> 
            </div>
            <div className="texte"><a className="lien2" href="/signup">créer compte</a></div>
          </div>
        </div>
       </div>
      </Form>
      <div className="cover">
        <img className="coverimage" src={image}/>
      </div>
    </div>
    </div>
  )

}
export default Login;