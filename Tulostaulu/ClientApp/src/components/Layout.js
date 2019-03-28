import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
    displayName = Layout.name

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div class="container container-fluid">
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="navbar-brand" href="#">
                        <img src="turgs_logo.png"></img>
                    </a>
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="#">Ilmoittautuminen</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/arvonta">Arvonta</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/tulostaulu">Tulostaulu</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/lisaapelaaja">Lisää pelaaja</a>
                        </li>
                    </ul>
                </nav>
                <main>
                    {this.props.children}
                </main>
            </div>
        );
    }
}
