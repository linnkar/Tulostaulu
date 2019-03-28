import React, { Component } from 'react';
import Osallistujat from './Osallistujat';

export class Home extends Component {
  displayName = Home.name

  render() {
    return (
      <div>
        <Osallistujat />
      </div>
    );
  }
}
