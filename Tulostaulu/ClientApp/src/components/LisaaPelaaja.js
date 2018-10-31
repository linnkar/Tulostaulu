import React, { Component } from 'react';

export class LisaaPelaaja extends Component {
    displayName = LisaaPelaaja.name;
 
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.meniLapi = this.meniLapi.bind(this);
        this.tuliVika = this.tuliVika.bind(this);
        this.state = {
            tunnus: 0, lisatyt: {} };
    }

    meniLapi(data) {
        document.getElementById("Viesti").textContent = "Pelaajanlisäys onnistui!";
    }

    tuliVika(error) {
        document.getElementById("suruViesti").textContent = "Pelaajanlisäys epäonnistui!";
    }

    componentDidMount() {
        let reactComp = this;

        fetch('api/pelaajat/nextid')
            .then(function (response) {
                return response.json();
            })
            .then(function (myjson) {
                var newid = parseInt(JSON.stringify(myjson), 10);
                console.log("Myjson: " + JSON.stringify(myjson) + " " + newid);
                reactComp.setState({
                    tunnus: newid });
            })
        this.forceUpdate();
    }


    handleSubmit(event) {
        event.preventDefault();

        let reactComp = this;

        var peluri = {
            Tunnus: parseInt(event.target.tunnus.value, 10),
            Etunimi: event.target.etunimi.value,
            Sukunimi: event.target.sukunimi.value,
            Tasoitus: parseInt(event.target.tasoitus.value, 10)
        };
        console.log("Peluri:" + JSON.stringify(peluri));

        fetch('api/pelaajat', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(peluri)
        })
            .then((response) => {
                response.json()
            })
            .then((data) => {
                let newplayer = JSON.stringify(data);
                let joLisatyt = reactComp.state.lisatyt;
                joLisatyt.add(newplayer);
                reactComp.setState({ lisatyt: joLisatyt });
            })
            .catch((error) => { this.tuliVika(JSON.stringify(error)) })

        document.getElementById("lisaaPelaaja").reset();
        let uusitunnus = parseInt(event.target.tunnus.value, 10);
        this.setState({ tunnus: uusitunnus})
    }

    render() {
        return (
            <div>
                <form id="lisaaPelaaja" onSubmit={(e) => this.handleSubmit(e)}>
                    Tunnus:<input type="text" name="tunnus" value={this.state.tunnus +1} readOnly /><br />
                    Etunimi:<input type="text" name="etunimi" /><br />
                    Sukunimi:<input type="text" name="sukunimi" /><br />
                    <label>Tasoitus:</label><p>
                        <input type="radio" name="tasoitus" value="4" defaultChecked="checked" />4<br />
                        <input type="radio" name="tasoitus" value="8" />8<br />
                        <input type="radio" name="tasoitus" value="12" />12<br />
                    </p>
                    <input type="submit" value="Tallenna" />
                </form>
            </div>
        );
    }
}