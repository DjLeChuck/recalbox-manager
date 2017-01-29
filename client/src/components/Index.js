import React, { Component } from 'react';
import { Link } from 'react-router';
import gamepad from '../dependencies/img/gamepad.png';
import keyboard from '../dependencies/img/keyboard.png';

export default class Index extends Component {
  render() {
    return (
      <div>
        <div className="page-header"><h1>Accueil</h1></div>

        <div className="row">
          <div className="col-md-2 col-md-offset-2 text-center">
            <div className="panel panel-default">
              <div className="panel-body">
                <Link to="//localhost:8080/" target="_blank">
                  <img src={gamepad} alt="Utiliser le gamepad virtuel" />
                  <br />
                  <br />
                  Utiliser le gamepad virtuel
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-md-offset-2 text-center">
            <div className="panel panel-default">
              <div className="panel-body">
                <Link to="//localhost:8080/keyboard.html" target="_blank">
                  <img src={keyboard} alt="Utiliser le clavier virtuel" />
                  <br />
                  <br />
                  Utiliser le clavier virtuel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
