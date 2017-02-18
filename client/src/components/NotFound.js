import React, { PropTypes } from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router';
import logo from '../logo.png';

class NotFound extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  render() {
    const { t } = this.props;

    return (
      <div className="not-found text-center">
        <h1>404</h1>
        <h2>{t('Page introuvable !')}</h2>

        <img src={logo} alt="Recalbox" />

        <p>
          <Link to="/">{t("Retour à la page d'accueil")}</Link>
        </p>
      </div>
    );
  }
}

export default translate()(NotFound);
