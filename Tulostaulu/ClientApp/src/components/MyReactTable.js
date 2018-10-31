import React, {Component} from 'react';
import {render} from 'react-dom';

//import  {Table} from 'react-bootstrap';
import styles from './style.css';

const pelaajat = [
    {
        id : "1",
        nimi: "Pete",
        k1 : "0",
        k2 : "0",
        tas : "4"
    },
    {
        id: "2",
        nimi: "Jari",
        k1 : "0",
        k2 : "0",
        tas : "8"
    }
];


class TableRow extends Component {
   constructor (props) {
      super (props);
      this.state = {
         row : this.props.row
      };
      
   }

   laskeTulos (e) {
      let myRow = this.props.row;
      let cell = myRow.nimi+"-yht";
      let cellTotal = myRow.nimi+"-yht2";
      let cellTasoitus = myRow.nimi+"-tas";
      let scoreLabel = document.getElementById(cell);
      let totalCell = document.getElementById(cellTotal);
      let tasoitusCell = document.getElementById(cellTasoitus);

       let k1 = parseInt(document.getElementById(myRow.nimi + "-k1").value, 10) || 0;
       let k2 = parseInt(document.getElementById(myRow.nimi + "-k2").value, 10) || 0;
       scoreLabel.value = k1 + k2;

       let tas = parseInt(tasoitusCell.value, 10) || 0;
       totalCell.value = k1 + k2 - tas;

       myRow.k1 = k1;
       myRow.k2 = k2;
       this.setState({row:myRow});
   }


   render () {
      return (
         <tr key={this.props.row.nimi+"-row"}>
            <td key={this.props.row.nimi}>
               <input type="text" value={this.props.row.nimi} className="nimi2" readOnly/>
            </td>
            <td key={this.props.row.nimi+"k1"}>
                  <input type="text" id={this.props.row.nimi + "-k1"} className="tuloste" onBlur={(e) => this.laskeTulos(e)}/>
            </td>
            <td key={this.props.row.nimi+"k2"}>
                  <input type="text" id={this.props.row.nimi + "-k2"} className="tuloste" onBlur={(e) => this.laskeTulos(e)}/>
            </td>
            <td key={this.props.row.nimi+"yht"}>
                  <input id={this.props.row.nimi + "-yht"} type="text" className="tuloste" readOnly/>
            </td>
            <td key={this.props.row.nimi+"tas"}>
                  <input id={this.props.row.nimi + "-tas"} type="text" className="tuloste" defaultValue={this.props.row.tas}/>
            </td>
            <td key={this.props.row.nimi+"yht2"}>
                  <input id={this.props.row.nimi + "-yht2"} type="text" className="tuloste" readOnly/>
            </td>
         </tr>
      )
   }
}

class Table extends Component {
   constructor (props) {
      super (props);
      this.state = {rowArray : []}
   }

   render () {
      return (
          <table className="taulu">
            <thead>
               <tr>
                      <th className="nimi2">Nimi</th>
                      <th className="tuloste">1</th>
                      <th className="tuloste">2</th>
                      <th className="tuloste">Yht</th>
                      <th className="tuloste">Tas</th>
                      <th className="tuloste">Yht</th>
               </tr>
            </thead>
            <tbody>
               {this.props.data.map (row => <TableRow key={row.nimi} row={row}/>)}
            </tbody>
         </table>
      );
   }
}

export default class MyReactTable extends Component {
   constructor (props) {
      super (props);
      this.state = { data : pelaajat };
   }

   render() {
      return (
         <Table data={pelaajat} />
      );
   }
}
