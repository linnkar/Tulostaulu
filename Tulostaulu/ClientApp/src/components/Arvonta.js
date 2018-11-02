import React, { Component } from 'react';

import paivays from './ApuFunktiot';
import styles from './style.css';

export class Arvonta extends Component {
  displayName = Arvonta.name

  constructor(props) {
      super(props);
      this.state = {
          mukana: [],
          luettu: false,
          nimet: false,
          listattu : false
      };
      this.lueNimet = this.lueNimet.bind(this);
    }

    lueNimet(pelissa) {
        var reactComp = this;

        pelissa.forEach((el) => {
            //console.log("Tunnus: " + el.pelaajaTunnus)
            fetch('api/Pelaajat/pelaaja/' + el.pelaajaTunnus) 
                .then(function (response) {
                    return response.json();
                })
                .then(function (myjson) {
                    reactComp.state.mukana.push(myjson[0]);
                    //reactComp.setState((state) => ({ mukana:state.mukana.push(myjson[0]) }));
                    reactComp.setState({luettu : true});
                })
                .catch((error) => console.log("Error: " + error))
        });
    }

    componentDidMount() {
        let reactComp = this;

        var paiva = paivays(new Date());

        fetch('api/tulokset/mukana/' + paiva)
            .then(function (response) {
                return response.json();
            })
            .then(function (myjson) {
                //console.log("Pelissa: " + JSON.stringify(myjson));
                if (myjson.length > 0) {
                    reactComp.lueNimet(myjson);
                }
            })
            .catch((error) => console.log("Error: " + error))

        this.setState({luettu : true});
        //this.forceUpdate();
    }

    seuraavaSivu(e) {
        this.props.history.push('/tulostaulu');
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
        const Pooli = []

        if (data.length > 0) {
            //console.log("Data: " + JSON.stringify(data));
            data.map(row => {
                //console.log("Nimi:" + row.etunimi);
                Pooli.push(
                    <li key={row.tunnus}>
                        <label>
                            {row.etunimi + " " + row.sukunimi}
                        </label>
                    </li>
                )
            }
            )
        }
        //this.setState({listattu:true});
        return Pooli;
    }

  render() {
      var paiva = paivays(new Date());

      return (
      <div>
              <div>
              <h2>Lähtölista  {paiva}</h2>
              </div>
              <div className="mukana">
                      <ul className="checkbox">
                          {this.state.mukana.length >3 && this.kasittelePooli(this.state.mukana)}
                      </ul>
                      <br />
                  <button onClick={(e) => this.fisherYatesSekoita(this.state.mukana)}>Arvo</button>
                  <button id="jatka" onClick={(e) => this.seuraavaSivu(e)}>Hyväksy</button>
              </div>
      </div>
    );
  }
}
