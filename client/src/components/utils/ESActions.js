import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Panel from 'react-bootstrap/lib/Panel';
import PostActionButton from './PostActionButton';

class ESActions extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  render() {
    const { t } = this.props;

    return (
      <Panel bsStyle="warning"
        header={<h3>{t("Redémarrage et arrêt d'EmulationStation")}</h3>}>
        <PostActionButton bsStyle="warning" action="reboot-es">
          {t("Redémarer ES")}
        </PostActionButton>{' '}

        <PostActionButton bsStyle="danger" action="shutdown-es">
          {t("Arrêter ES")}
        </PostActionButton>{' '}

        <PostActionButton bsStyle="success" action="start-es">
          {t("Démarrer ES")}
        </PostActionButton>
      </Panel>
    );
  }
}

export default translate()(ESActions);
