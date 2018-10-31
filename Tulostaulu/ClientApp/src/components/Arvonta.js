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
                    reactComp.setState({ nimet: true });
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
        this.forceUpdate();
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
                            <input
                                type="checkbox"
                                key={row.tunnus}
                                name={row.tunnus}
                                onChange={(e) => this.checkboxChange(e)}
                                value={row.tunnus} />{row.etunimi + " " + row.sukunimi}
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
      return (
      <div>
              <div>
                  <h2>Lähtölista</h2>
              </div>
              <div className="mukana">
                  <form>
                      <ul className="checkbox">
                          {this.state.mukana.length >3 && this.kasittelePooli(this.state.mukana)}
                      </ul>
                      <br />
                      <button>Arvo</button>
                      <button id="jatka" disabled>Hyväksy</button>
                  </form>
              </div>
      </div>
    );
  }
}
