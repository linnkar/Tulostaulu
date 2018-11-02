import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { LisaaPelaaja } from './components/LisaaPelaaja';
import { Osallistujat } from './components/Osallistujat';
import { Arvonta } from './components/Arvonta';
import MyReactTable from './components/tulosTaulu';

export default class App extends Component {
  displayName = App.name

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/lisaapelaaja' component={LisaaPelaaja} />
        <Route path='/reception' component={Osallistujat} />
        <Route path='/arvonta' component={Arvonta} />
        <Route path='/tulostaulu' component={MyReactTable} />
      </Layout>
    );
  }
}
