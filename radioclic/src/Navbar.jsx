import React from "react";
import { Link } from "react-router-dom";
import {Navbar,Container,NavDropdown,Collapse,Nav} from 'react-bootstrap';
import './Nav.css';
import logo from '../src/assets/logo.png';
function Navbars(){
    return(
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container className="container">
          <Navbar.Brand>
            <img className="navlogo" src={logo}/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className="link" href="/home">Accueil</Nav.Link>
              <Nav.Link className="link"  href="/hopital">Hôpital</Nav.Link>
              <Nav.Link className="link"  href="/contact">Contact</Nav.Link>
              <Nav.Link className="link"  href="#link">A propos</Nav.Link>
            </Nav>
            <Nav>
              <Link to="/login" className="navbutton">Se connecter</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}
export default Navbars