import React, { Component } from 'react';
import MyReactTable from './tulosTaulu';

export class Home extends Component {
  displayName = Home.name

  render() {
    return (
      <div>
        <MyReactTable />
      </div>
    );
  }
}
