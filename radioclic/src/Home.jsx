import React, {useEffect} from "react";
import home from '../src/assets/home.jpg';
import proposs from '../src/assets/proposs.jpg';
import service from '../src/assets/services.png';
import professionnalisme from '../src/assets/professional.png';
import confidentialité from '../src/assets/securite.png';
import disponibilite from '../src/assets/disponibilite.png';
import Footer from '../src/Footer';
import Navbars from "../src/Navbar";
import '../src/Home.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
function Home(){

    const getData= async() =>{
        try{
            const response = await axios.post('http://localhost:5000/api/user/get-user-info-by-id', {},
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            console.log(response.data)
        }catch (error){
            console.log(error)
        }
    }

    useEffect( () =>{
        getData()
    }, [])
    return(
        <>
          <Navbars />
          <header>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-lg-6">
                        <h2>Rendez-vous, Résultats, Tout en seul clic</h2>
                        <p className="p1">Dites adieu aux processus laborieux et simplifiez votre quotidien en planifiant vos rendes-vous et en accédant à vos résultats en un seul clic</p>
                    </div>
                    <div className="col-lg-6 col-md-6">
                         <div className="header-box">
                             <img className="headerimg" src={home} alt=""/>
                         </div>
                    </div>
                </div>
            </div>
            <div className="wrapper">
                <div className="roww">
                    <div className="image-section">
                        <img className="about" src={proposs}/>
                    </div>
                    <div className="content">
                        <h1>À propos de nous</h1>
                        <p className="p2">RadioClic est conçue avec un engagement absolu envers l'excellence des soins aux patients et l'efficacité opérationnelle. 
                           En tant que partenaire privilégié de l’hôpital Fattouma Bourguiba Monastir, nous nous efforçons de fournir une plateforme intuitive et sécurisée qui facilite la communication entre les patients, 
                           les radiologues et les techniciens. Notre équipe est dévouée à développer des solutions innovantes qui améliorent l'accessibilité, la qualité et la rapidité des services radiologiques, 
                           garantissant ainsi une expérience patient optimale. Avec notre engagement envers la technologie de pointe et une approche centrée sur l'utilisateur, nous nous engageons à soutenir les professionnels de la santé dans leur mission vitale de fournir des soins de qualité supérieure à chaque patient.
                        </p>
                    </div>
                </div>
            </div>
            <div className="souswrapper">
               <div className="column">
                <div className="text">Pourquoi nous choisir ?</div>
                <div className="photos">
                    <img className="image" src={service}/>
                    <img className="image" src={professionnalisme}/>
                    <img className="image" src={confidentialité}/>
                    <img className="image" src={disponibilite}/>
                </div>
                <div className="soustext">
                    <h5 className="soustext1">Qualité des services</h5>
                    <h5 className="soustext2">Professionnalisme</h5>
                    <h5 className="soustext3">Confidentialité et sécurité</h5>
                    <h5 className="soustext4">Disponibilité</h5>
                </div>
               </div> 
            </div>
        </header>
        <Footer />
        </>

    )
}
export default Home;