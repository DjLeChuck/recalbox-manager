import React, { PropTypes } from 'react';
import { translate } from 'react-i18next';
import DropzoneComponent from 'react-dropzone-component';

import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css';

class DropZone extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    params: PropTypes.object,
  }

  static defaultProps = {
    params: {},
  }

  constructor(props) {
    super(props);

    this.componentConfig = { postUrl: `/upload/${this.props.type}` };
    this.handlers = {
      success: (file, result) => {
        this.props.onSuccess(result);
      },
      error: (file, err) => {
        console.error(file, err);
      }
    };
    const t = this.props.t;
    const params = Object.assign({}, this.props.params);
    params.type = this.props.type;
    this.djsConfig = {
      dictDefaultMessage: t('Déposer des fichiers ici pour les uploader.'),
      dictResponseError: t("Erreur lors de l'upload."),
      addRemoveLinks: true,
      dictCancelUpload: t("Annuler l'upload"),
      dictCancelUploadConfirmation: t('Êtes-vous sûr de vouloir annuler cet upload ?'),
      dictRemoveFile: t('Retirer le fichier'),
      params: params,
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
