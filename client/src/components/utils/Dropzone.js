import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import DropzoneComponent from 'react-dropzone-component';

import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css';

class DropZone extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    params: PropTypes.object,
    dropLabel: PropTypes.string,
  };

  static defaultProps = {
    params: {},
  };

  constructor(props) {
    super(props);

    const { t, type, onSuccess, params, dropLabel } = this.props;
    this.componentConfig = { postUrl: `/upload/${type}` };
    this.handlers = {
      success: (file, result) => onSuccess(result),
      error: (file, err) => console.error(file, err)
    };
    const dzParams = Object.assign({}, params);
    dzParams.type = type;
    this.djsConfig = {
      dictDefaultMessage: dropLabel || t('Déposer des fichiers ici pour les uploader.'),
      dictResponseError: t("Erreur lors de l'upload."),
      addRemoveLinks: true,
      dictCancelUpload: t("Annuler l'upload"),
      dictCancelUploadConfirmation: t('Êtes-vous sûr de vouloir annuler cet upload ?'),
      dictRemoveFile: t('Retirer le fichier'),
      params: dzParams,
    };
  }

  render() {
    return (
      <DropzoneComponent config={this.componentConfig}
        djsConfig={this.djsConfig} eventHandlers={this.handlers} />
    );
  }
}

export default translate()(DropZone);
