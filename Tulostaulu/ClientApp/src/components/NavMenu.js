import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './NavMenu.css';

export class NavMenu extends Component {
  displayName = NavMenu.name

  render() {
    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">
                <img src="./../../public/turgs.png" width="30" height="30" alt=""></img>
                Tulostaulu
            </a>
            <div class="collapse navbar-collapse" id="navBarNav">
                <div class="navbar-nav bg-danger">
                    <a class="nav-item nav-link active" href="#">Ilmoittautuminen</a>
                    <a class="nav-item nav-link" href="/arvonta">Arvonta</a>
                    <a class="nav-item nav-link" href="/tulostaulu">Tulostaulu</a>
                    <a class="nav-item nav-link" href="/lisaapelaaja">Lisää pelaaja</a>
                </div>
            </div>
        </nav>
    );
  }
}
