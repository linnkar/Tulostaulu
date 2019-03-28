import React, {Component} from 'react';
import { render } from 'react-dom';
import { Redirect } from 'react-router-dom'; 

//import  {Table} from 'react-bootstrap';
import styles from './style.css';
import paivays from './ApuFunktiot';

class TableRow extends Component {
   constructor (props) {
      super (props);
      this.state = {
          row: this.props.row
      }; 
   }

    talleta(uusiTulos) {
        fetch('api/tulokset/paivita', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uusiTulos)
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Response: " + response.status);
                }
                else {
                    console.log("Response: " + response.status);
                }
            })
            .then(console.log("Tallennus valmis"))
            .catch((err) => { return err; })
    }

    muutaTasoitus(e) {
        let myRow = this.props.row;
        let cellTasoitus = myRow.Nimi + "-tas";
        let tasoitusCell = document.getElementById(cellTasoitus);
        let tas = parseInt(tasoitusCell.value, 10) || 0;
        var uusiTulos = {
            Tunnus: myRow.Tunnus,
            K1: 0,
            K2: 0,
            Tasoitus: tas,
            Mukana: 4
        }

        this.talleta(uusiTulos);

        myRow.Tasoitus = tas;
        this.setState({ row: myRow });
    }

    laskeTulos(e) {
        let myRow = this.props.row;
        console.log("Tunnus: " + myRow.Tunnus);
        let cell = myRow.Nimi + "-yht";
        let cellTotal = myRow.Nimi + "-yht2";
        let cellTasoitus = myRow.Nimi + "-tas";
        let scoreLabel = document.getElementById(cell);
        let totalCell = document.getElementById(cellTotal);
        let tasoitusCell = document.getElementById(cellTasoitus);

        let k1 = parseInt(document.getElementById(myRow.Nimi + "-k1").value, 10) || 0;
        let k2 = parseInt(document.getElementById(myRow.Nimi + "-k2").value, 10) || 0;
        scoreLabel.value = k1 + k2;

        let tas = parseInt(tasoitusCell.value, 10) || 0;
        totalCell.value = k1 + k2 - tas;

        var uusiTulos = {
            Tunnus: myRow.Tunnus,
            K1: k1,
            K2: k2,
            Tasoitus: tas,
            Mukana: 0
        }

        const kierros = e.target.id.split("-")[1];
        if (kierros === "k1") {
            uusiTulos.Mukana = 1;
        }
        else if (kierros === "k2") {
            uusiTulos.Mukana = 2;
        }

        if (uusiTulos.Mukana !== 0) {
            this.talleta(uusiTulos);
        }

       myRow.k1 = k1;
       myRow.k2 = k2;
       this.setState({row:myRow});
   }

    render() {
        var rivi = this.props.row;

      return (
         <tr key={rivi.Nimi+"-row"}>
            <td key={rivi.Nimi}>
                  <input type="text" value={rivi.Nimi}
                      className="nimi2" readOnly />
            </td>
            <td key={rivi.Nimi+"k1"}>
                  <input type="text" id={rivi.Nimi + "-k1"} className="tuloste" onBlur={(e) => this.laskeTulos(e)}/>
            </td>
            <td key={rivi.Nimi+"k2"}>
                  <input type="text" id={rivi.Nimi + "-k2"} className="tuloste" onBlur={(e) => this.laskeTulos(e)}/>
            </td>
            <td key={rivi.Nimi+"yht"}>
                  <input id={rivi.Nimi + "-yht"} type="text" className="tuloste" readOnly/>
            </td>
            <td key={rivi.Nimi+"tas"}>
                  <input id={rivi.Nimi + "-tas"} type="text" className="tuloste"
                      defaultValue={this.props.row.Tasoitus} onBlur={(e) => this.muutaTasoitus(e)} />
            </td>
            <td key={rivi.Nimi+"yht2"}>
                  <input id={rivi.Nimi + "-yht2"} type="text" className="tuloste" readOnly/>
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
      var paiva = paivays(new Date());

      if (this.props.data.length === 0) return (<p>No data</p>)
        return (
            <div>
            <h2>{paiva}</h2>
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
               {this.props.data.map (row => <TableRow key={row.Tunnus} row={row}/>)}
            </tbody>
                </table>
                </div>
      );
   }
}

export default class MyReactTable extends Component {
   constructor (props) {
      super (props);
       this.state = {
           data: []
       };
   }

    componentDidMount() {
        let reactComp = this;
        var paiva = paivays(new Date());

//        fetch('api/tulokset/v2/mukana/' + paiva)
        fetch('api/tulokset/lahtojarjestys')
            .then(function (response) {
                return response.json();
            })
            .then(function (myjson) {
                console.log("Myjson: " + JSON.stringify(myjson));
                reactComp.setState({data: myjson });
            })
            .catch((error) => console.log("Error: " + error))
    }

    tulokset(e) {

    }

   render() {
       return (
          <div>
               <Table data={this.state.data} />
               <p></p>
               <button id="jatka" onClick={(e) => this.tulokset(e)}>Hyväksy</button>
          </div>
      );
   }
}
