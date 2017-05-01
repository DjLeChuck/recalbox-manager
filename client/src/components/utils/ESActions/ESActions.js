import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Panel from 'react-bootstrap/lib/Panel';
import PostActionButton from '../PostActionButton';

const renderStatusAction = (t, status, onSuccess, onError) => {
  if ('OK' === status) {
    return (
      <PostActionButton bsStyle="danger" action="shutdown-es"
        onSuccess={onSuccess} onError={onError}>
        {t("Arrêter ES")}
      </PostActionButton>
    );
  }

  return (
    <PostActionButton bsStyle="success" action="start-es"
      onSuccess={onSuccess} onError={onError}>
      {t("Démarrer ES")}
    </PostActionButton>
  );
}

const ESActions = ({ t, status, onSuccess, onError }) => (
  <Panel bsStyle="warning"
    header={<h3>{t("Redémarrage et arrêt d'EmulationStation")}</h3>}>
    <PostActionButton bsStyle="warning" action="reboot-es"
      onSuccess={onSuccess} onError={onError}>
      {t("Redémarer ES")}
    </PostActionButton>{' '}

    {renderStatusAction(t, status, onSuccess, onError)}
  </Panel>
);

ESActions.propTypes = {
  t: PropTypes.func.isRequired,
  status: PropTypes.oneOf(['OK', 'KO']).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default translate()(ESActions);
