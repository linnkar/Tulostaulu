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
                <p></p>
                <form id="lisaaPelaaja" onSubmit={(e) => this.handleSubmit(e)} class="form-horizontal">
                    <div class="form-group form-inline">
                        <label for="tunnus" class="col-2 text-left">Tunnus:</label>
                        <input type="text" id="tunnus" name="tunnus" class="form-control col-4" value={this.state.tunnus +1} readOnly /><br />
                    </div>
                    <div class="form-group form-inline">
                        <label for="etunimi" class="col-2">Etunimi:</label>
                        <input type="text" id="etunimi" class="form-control col-4" name="etunimi" />
                    </div>
                    <div class="form-group form-inline">
                        <label for="sukunimi" class="col-2">Sukunimi:</label>
                        <input type="text" id="sukunimi" class="form-control col-4" name="sukunimi" />
                    </div>
                    <div class="form-group" id="tasoitukset" >
                        <div class="custom-control custom-radio">
                            <label class="col-2 tasoitusleima" for="tasoitus4">Tasoitus:</label>
                            <input type="radio" id="tasoitus4" name="tasoitus" value="4" class="custom-control-input" defaultChecked="checked" />
                            <label for="tasoitus4" class="custom-control-label">4</label>
                        </div>    
                        <div class="custom-control custom-radio">
                            <label class="col-2 tasoitusleima" for="tasoitus8"></label>
                            <input type="radio" id="tasoitus8" name="tasoitus" value="8" class="custom-control-input" />
                            <label for="tasoitus8" class="custom-control-label">8</label>
                        </div>    
                        <div class="custom-control custom-radio tasoitusleima2">
                            <label class="col-2" for="tasoitus12"></label>
                            <input type="radio" id="tasoitus12" name="tasoitus" value="12" class="custom-control-input" />
                            <label for="tasoitus12" class="custom-control-label">12</label>
                        </div>  
                    </div>
                    <div>
                        <input type="submit" id="submit" value="Tallenna" class="osallistujanappi" />
                    </div>
                </form>
            </div>
        );
    }
}