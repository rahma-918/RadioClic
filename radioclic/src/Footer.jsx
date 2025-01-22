import React from "react";
import logo from '../src/assets/logo.png';
import facebook from '../src/assets/facebook.png';
import instagram from '../src/assets/instagram.png';
import twitter from '../src/assets/twitter.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { faLocationDot} from '@fortawesome/free-solid-svg-icons';
import { faPhone} from '@fortawesome/free-solid-svg-icons';
import { faCopyright} from '@fortawesome/free-solid-svg-icons';
import './Footer.css';
function Footer(){
    return(
        <footer>
        <div className="conteneur">
            <div className="col-md-3 col-sm-6">
                <img src={logo} className="footerlogo"/>
                <p>Rendez-vous, Résultats, Tout en seul clic</p>
                <ul className="social">
                    <li><a href="#"><img src={facebook}/></a></li>
                    <li><a href="#"><img src={instagram}/></a></li>
                    <li><a href="#"><img src={twitter}/></a></li>
                </ul>
            </div>
            <div className="rightbloc">
                    <h2>Contactez nous</h2>
                    <ul className="contact">
                        <li><FontAwesomeIcon className="icon" icon={faLocationDot}/><p>Rue du 1er juin 1955 5000 Monastir</p></li>
                        <li><FontAwesomeIcon className="icon"  icon={faEnvelope}/><p>RadioClic@gmail.com</p></li>
                        <li><FontAwesomeIcon className="icon"  icon={faPhone}/><p>51773302</p></li>
                    </ul>

            </div>
            
        </div>
        <div className="footer-bottom">
            <div className="conteneur">
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <span><FontAwesomeIcon icon={faCopyright}/>2024 RadioClic, Tous droits réservés.</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    );
}
export default Footer;