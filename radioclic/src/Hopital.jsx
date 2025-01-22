import React from "react";
import hopital from '../src/assets/hopital.jpg';
import localisation from '../src/assets/localhopital.png';
import '../src/Hopital.css';
import Navbars from "../src/Navbar";
import Footer from "../src/Footer";
function Hopital(){
    return(
        <>
        <Navbars />
          <div>
            <div className="headers">
                <div className="contenu">
                    <h3>CHU Fattouma Bourguiba Monastir</h3>
                    <div className="info">
                    <div className="line">
                        <h5>Adresse:</h5>
                        <h6>Rue du 1er juin 1995-Monastir-5000</h6>
                    </div>
                    <div className="line">
                        <h5>Tel:</h5>
                        <h6>+216 73 447 108</h6>
                    </div>
                    <div className="line">
                        <h5>Fax:</h5>
                        <h6>+216 73 460 678</h6>
                    </div>
                    <div className="line">
                        <h5>Urgence:</h5>
                        <h6>+216 73.460.411 / 73.447.108</h6>
                    </div>
                    </div>
                </div>
                <div className="image">
                    <img src={localisation}/>
                </div>

            </div>
            <div className="wrapper">
            <div className="roww">
                <div className="image-section">
                    <img src={hopital}/>
                </div>
                <div className="content">
                    <h1>À propos Hôpital Fattouma-Bourguiba de Monastir</h1>
                    <p className="p2">
                        L'hôpital Fattouma-Bourguiba de Monastir est un établissement de santé publique et un centre hospitalo-universitaire tunisien situé à Monastir.
                        C'est un établissement public à caractère administratif doté de la personnalité morale et de l'autonomie financière tout en étant sous la supervision du ministère de la Santé.
                        L'hôpital universitaire Fattouma-Bourguiba est considéré comme l'un des piliers de l'infrastructure de santé du pays grâce à la diversité de ses spécialités et à la compétence de ses équipes opérationnelles.
                        Ce centre hospitalo-universitaire participe activement à l'enseignement universitaire et post-universitaire dans les domaines de la médecine, de la pharmacie et de la médecine dentaire ainsi qu'au secteur paramédical. 
                        Il contribue également à des travaux de recherche scientifique en matière de médecine, de pharmacie et de médecine dentaire.
                    </p>
                </div>
            </div>
        </div>
        </div>
        <Footer />

        </>
        
    );
}
export default Hopital