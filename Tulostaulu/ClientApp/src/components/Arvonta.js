import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import paivays from './ApuFunktiot';
import styles from './style.css';

export class Arvonta extends Component {
  displayName = Arvonta.name

  constructor(props) {
      super(props);
      this.state = {
          mukana: [],
          valmis: false
      };
    }

    componentDidMount() {
        let reactComp = this;

        var paiva = paivays(new Date());

        fetch('api/tulokset/v2/mukana/' + paiva)
            .then(function (response) {
                return response.json();
            })
            .then(function (myjson) {
                //console.log("Pelissa: " + JSON.stringify(myjson));
                reactComp.setState({ mukana: myjson });
            })
            .catch((error) => console.log("Error: " + error))

        //this.forceUpdate();
    }


    seuraavaSivu(e) {
        fetch('api/tulokset/lahtojarjestys', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.mukana)
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Response: " + response.status);
                }
            })
            .then(this.setState({valmis : true}))
            .catch((err) => { return err; })
        
    }

    fisherYatesSekoita(vektori) {
        var koko = vektori.length;
        if (koko === 0) return false;
        while (--koko) {
            var j = Math.floor(Math.random() * (koko + 1));
            var tmp1 = vektori[koko];
            var tmp2 = vektori[j];
            vektori[koko] = tmp2;
            vektori[j] = tmp1;
        }
        this.setState({mukana : vektori});
        return true;
    }

    kasittelePooli(data) {
        var Pooli = [];
        var i = 1;
        var maara = data.length;
        var erotin = maara % 3;

        if (data.length > 0) {
            //console.log("Data: " + JSON.stringify(data));
            data.map(row => {
                //console.log("Nimi:" + row.etunimi);
                Pooli.push(
                    <li key={row.Tunnus}>
                        <label>
                            {row.Nimi}
                        </label>
                    </li>
                )
                if (i === 2 && maara % 3 === 2) {
                    Pooli.push(
                        <li key={row.Nimi}><label>--------------------------------------</label></li>)
                }
                else if ((i === 2 || i === 4) && maara % 3 === 1) {
                    Pooli.push(
                        <li key={row.Nimi}><label>--------------------------------------</label></li>)
                }
                else if ((i === 3) && (maara % 3 === 0)) {
                    Pooli.push(
                        <li key={row.Nimi}><label>--------------------------------------</label></li>)
                }
                else if ((maara - i) % 3 === 0 && i < maara) {
                    Pooli.push(
                        <li key={row.Nimi}><label>--------------------------------------</label></li>)
                }
                i++
            }
            )
        }
        //this.setState({listattu:true});
        return Pooli;
    }

  render() {
      var paiva = paivays(new Date());

      if (this.state.valmis == true) {
          return <Redirect to='/tulosTaulu' />
      }

      return (
      <div>
              <div>
              <h2>Lähtölista {paiva}</h2>
              </div>
              <div className="mukana">
                      <ul className="checkbox">
                      {this.kasittelePooli(this.state.mukana)}
                      </ul>
                      <br />
                  <button onClick={(e) => this.fisherYatesSekoita(this.state.mukana)}>Arvo</button>
                  <button id="jatka" onClick={(e) => this.seuraavaSivu(e)}>Hyväksy</button>
              </div>
      </div>
    );
  }
}
