import React, { Component } from 'react';
import {render} from 'react-dom';

import styles from './style.css';
import paivays from './ApuFunktiot';

var pelaajat = [];
var pelaavat = [];


export class Osallistujat extends Component {
   constructor (props) {
      super (props)
      this.state = {
         kaikki  : pelaajat,
         pelissa : pelaavat
      }
      this.handleSubmit = this.handleSubmit.bind(this);
   }

    componentDidMount() {
        let reactComp = this;

        fetch('api/Pelaajat')
            .then(function (response) {
                return response.json();
            })
            .then(function (myjson) {
                console.log("Myjson: " + JSON.stringify(myjson));
                pelaajat = myjson;
                reactComp.setState({ kaikki: myjson });
            })
            .catch ((error) => console.log("Error: " + error))

        this.forceUpdate();
    }

    handleSubmit(event) {
        event.preventDefault();
        // Kilpailuun osallistuvat on muuttujassa pelaavat 
        const paikalla = this.state.pelissa;
        var paiva = paivays(new Date());
        var pelaajanTulos = [];

        console.log("Paivays: " + paiva);

        paikalla.forEach((el) => {
            var tulosrivi = {
                PelaajaTunnus: parseInt(el.tunnus, 10),
                Paiva: paiva,
                K1: parseInt(0, 10),
                K2: parseInt(0, 10),
                Tasoitus: parseInt(el.tasoitus, 10)
            }

            console.log("Tulosrivi: " + JSON.stringify(tulosrivi));
            pelaajanTulos.push(tulosrivi);
        })

            fetch('api/tulokset/lisaarivi', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pelaajanTulos)
            })
                .then((response) => {
                    if (response.ok) {
                        console.log("Response: " + response.text())
                    }
                })
                .then(this.props.history.push('/Arvonta'))
                .catch((error) => console.log(error))

        
        pelaavat = [];

   }

   checkboxChange (event) {
      var joukko = this.state.kaikki
      var result = joukko.filter((peluri) => 
      {
          return parseInt(peluri.tunnus, 10) === parseInt(event.target.value, 10)
      })
       
       if (result.length !== 0) {
         pelaavat.push (result[0])
         pelaajat = joukko.filter((peluri) => 
            {return parseInt(peluri.tunnus,10) !== parseInt(event.target.value, 10)})
         this.setState({kaikki : joukko.filter((peluri) => 
            {return parseInt(peluri.tunnus, 10) !== parseInt(event.target.value,10)})})
         this.setState({pelissa: pelaavat})
      }
      else {
         var pelaa = this.state.pelissa
         result = pelaa.filter((peluri) => 
             {return parseInt(peluri.tunnus,10) === parseInt(event.target.value, 10)})
         pelaajat.push (result[0])
         pelaavat = pelaa.filter((peluri) => 
            {return parseInt(peluri.tunnus,10) !== parseInt(event.target.value, 10)})
         this.setState({pelissa : pelaa.filter((peluri) => 
            {return parseInt(peluri.tunnus, 10) !== parseInt(event.target.value, 10)})})
         this.setState({kaikki:pelaajat})
       }
       this.forceUpdate()
   }

   kasittelePooli (data) {
       const Pooli = []

      data.map (row => {
         Pooli.push (
             <li key={row.tunnus}>
               <label>
                  <input 
                     type="checkbox" 
                     key={row.tunnus} 
                     name={row.tunnus} 
                     onChange={(e) => this.checkboxChange(e)}
                     value={row.tunnus}/>{row.etunimi + " "  + row.sukunimi}
               </label>
               </li>
         )
         }
      )

      return Pooli;
   }

   render () {

      return (
         <div>  
            <div><h2>Ilmoittautuminen</h2></div>
            <div className="varasto"><h3>Poissa</h3>
               <form>
                  <ul className="checkbox">
                     {this.kasittelePooli (this.state.kaikki)}
                  </ul>
               </form>
            </div>
            <div className="mukana"><h3>Läsnä</h3>
               <form onSubmit={this.handleSubmit}>
                  <ul className="checkbox">
                     {this.kasittelePooli (pelaavat)}
                  </ul><br/>
                  <button>Valmis</button>
               </form>
            </div>
         </div>
      );
    }
}

export default Osallistujat.kasittelePooli;
