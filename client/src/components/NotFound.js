import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Link } from 'react-router';
import logo from '../logo.png';

const NotFound = ({ t }) => (
  <div className="not-found text-center">
    <h1>404</h1>
    <h2>{t('Page introuvable !')}</h2>

    <img src={logo} alt="Recalbox" />

    <p>
      <Link to="/">{t("Retour à la page d'accueil")}</Link>
    </p>
  </div>
);

NotFound.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate()(NotFound);
