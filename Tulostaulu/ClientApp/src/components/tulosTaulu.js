import React, {Component} from 'react';
import {render} from 'react-dom';

//import  {Table} from 'react-bootstrap';
import styles from './style.css';


const pelaajat = [
    {
        etunimi: "Pete",
        sukunimi: "Piikki",
        k1: "0",
        k2: "0",
        yht: "0",
        tas: "4",
        yht2: "0"
    },
    {
        etunimi: "Jari",
        sukunimi: "Jänne",
        k1: "0",
        k2: "0",
        yht: "0",
        tas: "8",
        yht2: "0"
    },
    {
        etunimi: "Saara",
        sukunimi: "Maila",
        k1: "0",
        k2: "0",
        yht: "0",
        tas: "4",
        yht2: "0"
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
      let cell = myRow.etunimi+"-yht";
      let cellTotal = myRow.etunimi+"-yht2";
      let cellTasoitus = myRow.etunimi+"-tas";
      let scoreLabel = document.getElementById(cell);
      let totalCell = document.getElementById(cellTotal);
      let tasoitusCell = document.getElementById(cellTasoitus);

       let k1 = parseInt(document.getElementById(myRow.etunimi + "-k1").value, 10) || 0;
       let k2 = parseInt(document.getElementById(myRow.etunimi + "-k2").value, 10) || 0;
       scoreLabel.value = k1 + k2;

       let tas = parseInt(tasoitusCell.value, 10) || 0;
       totalCell.value = k1 + k2 - tas;

       myRow.k1 = k1;
       myRow.k2 = k2;
       this.setState({row:myRow});
   }


    render() {
        var rivi = this.props.row;
      return (
         <tr key={rivi.etunimi+"-row"}>
            <td key={rivi.etunimi}>
                  <input type="text" value={rivi.etunimi + " " + rivi.sukunimi}
                      className="nimi2" readOnly />
            </td>
            <td key={rivi.etunimi+"k1"}>
                  <input type="text" id={rivi.etunimi + "-k1"} className="tuloste" onBlur={(e) => this.laskeTulos(e)}/>
            </td>
            <td key={rivi.etunimi+"k2"}>
                  <input type="text" id={rivi.etunimi + "-k2"} className="tuloste" onBlur={(e) => this.laskeTulos(e)}/>
            </td>
            <td key={rivi.etunimi+"yht"}>
                  <input id={rivi.etunimi + "-yht"} type="text" className="tuloste" readOnly/>
            </td>
            <td key={rivi.etunimi+"tas"}>
                  <input id={rivi.etunimi + "-tas"} type="text" className="tuloste" defaultValue={this.props.row.tas}/>
            </td>
            <td key={rivi.etunimi+"yht2"}>
                  <input id={rivi.etunimi + "-yht2"} type="text" className="tuloste" readOnly/>
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

    render() {

      if (this.props.data.length === 0) return (<p>No data</p>)
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
       this.state = {
           data: pelaajat
       };
   }

   

   render() {
      return (
         <Table data={pelaajat} />
      );
   }
}
