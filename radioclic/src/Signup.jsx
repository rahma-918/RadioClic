import React, { useState } from "react";
import { Form, Input, Select, Button, DatePicker } from "antd";
import image from './assets/image.png';
import "./Signup.css";
import {useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showSecretKeyField, setShowSecretKeyField] = useState(false);
  const [form] = Form.useForm();

  const handleTypeChange = (value) => {
    setShowAdditionalFields(value === "Patient");
    setShowSecretKeyField(value === "Admin");
  };

  const navigate = useNavigate();

  

  const onFinish = async () => {
    try {
        const values = await form.validateFields();
        const response = await axios.post("http://localhost:5000/api/user/signup", values);
        if (response.data.success) {
            toast.success(response.data.message);
            toast("Redirection vers la page de connexion");
            navigate("/login");

            // Si le type de compte est "Patient", créer le dossier médical
            if (values.typedecompte === "Patient") {
                await createMedicalRecord(response.data.userId);
                await createReport(response.data.userId);
            }

          
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error("Quelque chose s'est mal passé");
    }
};



const createMedicalRecord = async (userId) => {
  try {
      await axios.post(`http://localhost:5000/api/dossier-medical/create-medical-record/${userId}`);
  } catch (error) {
      console.error("Erreur lors de la création du dossier médical :", error);
  }
};


const createReport = async (userId) => {
  try {
    await axios.post(`http://localhost:5000/api/dossier-medical/create-report/${userId}`);
  } catch (error) {
    console.error("Erreur lors de la création du rapport médical :", error);
  }
};

const validatePhoneNumber = (_, value) => {
  if (!/^\d{8}$/.test(value)) {
    return Promise.reject(new Error("Le numéro de téléphone doit contenir 8 chiffres"));
  }
  return Promise.resolve();
};

const validateEmail = (_, value) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  if (!emailRegex.test(value)) {
    return Promise.reject(new Error("Veuillez saisir une adresse e-mail valide"));
  }
  return Promise.resolve();
};



  return (
    <div className="allcontainer">
      <div className="cont">
        <Form onFinish={onFinish} initialValues={{ typedecompte: "" }} form={form}>
          <div className="formulaire-content">
            <div className="login-form">
              <div className="title">Bienvenue!</div>
              <div className="boxes">
                <Form.Item label="Nom" name="nom" className="form-group" rules={[{ required: true, message: "Veuillez saisir votre nom" }]}>
                  <Input placeholder="Nom" />
                </Form.Item>
                <Form.Item label="Prenom" name="prenom" className="form-group" rules={[{ required: true, message: "Veuillez saisir votre prenom" }]}>
                  <Input placeholder="Prenom" />
                </Form.Item>
                <Form.Item label="E-mail" name="email" className="form-group" rules={[{ required: true, message: "Veuillez saisir votre e-mail" }, { validator: validateEmail }]}>
                  <Input placeholder="E-mail" autoComplete="email" />
                </Form.Item>
                <Form.Item label="Mot de passe" name="motdepasse" className="form-group" rules={[{ required: true, message: "Veuillez saisir votre mot de passe" }]}>
                  <Input placeholder="Mot de passe"
                    type={showPassword ? "text" : "password"} />
                </Form.Item>
                <Form.Item label="Telephone" name="telephone" className="form-group"  rules={[{ required: true, message: "Veuillez saisir votre numéro de téléphone" }, { validator: validatePhoneNumber }]}>
                  <Input placeholder="Telephone" />
                </Form.Item>
                <Form.Item label="Type de compte" name="typedecompte" className="form-group" rules={[{ required: true, message: "Veuillez choisir le type de votre compte" }]}>
                  <Select
                    className="selecttype"
                    placeholder="Type de compte"
                    onChange={handleTypeChange}
                  >
                    <Select.Option value="Secretaire">Secrétaire</Select.Option>
                    <Select.Option value="Radiologue">Radiologue</Select.Option>
                    <Select.Option value="Technicien en imagerie">Technicien</Select.Option>
                    <Select.Option value="Patient">Patient</Select.Option>
                  </Select>
                </Form.Item>
                {showAdditionalFields && (
                  <>
                    <Form.Item label="Sexe" name="sexe" className="form-group">
                      <Select placeholder="Sexe">
                        <Select.Option value="Masculin">Homme</Select.Option>
                        <Select.Option value="Féminin">Femme</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Date de naissance" name="datedenaissance" className="form-group">
                      <DatePicker placeholder="Date de naissance" />
                    </Form.Item>
                  </>
                )}
               {showSecretKeyField && ( 
                  <Form.Item label="Clé secrète" name="clé_secrete" className="form-group">
                    <Input placeholder="Clé secrète" />
                  </Form.Item>
                )}
                <div className="first-button">
                  <Button htmlType="submit">Créer compte</Button>
                </div>
              </div>
            </div>
          </div>
        </Form>
        <div className="cover">
        <img className="coverimage" src={image}/>
      </div>
      </div>
    </div>
  );
}

export default Signup;