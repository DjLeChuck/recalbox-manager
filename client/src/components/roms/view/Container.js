import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { get, grep } from '../../../api';
import { promisifyData, cancelPromises } from '../../../utils';
import RomsView from './View';

class RomsViewContainer extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    params: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      displayBackToTop: false,
      romsList: [],
      directoryListing: [],
      breadcrumb: [],
      bulkList: [],
    };
  }

  componentDidMount() {
    this.loadRoms(this.props.params);

    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);

    cancelPromises();
  }

  handleScroll = (event) => {
    if (!event.srcElement) {
      return;
    }

    const scrollTop = event.srcElement.body.scrollTop;

    this.setState({ displayBackToTop: (scrollTop > 50) });
  };

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps;

    if (
      this.props.params.system !== params.system ||
      this.props.params.splat !== params.splat
    ) {
      this.loadRoms(params);
    }
  }

  onUploadSuccess = ({ gameData }) => {
    const { t } = this.props;
    const romsList = [...this.state.romsList];

    romsList.push(gameData);
    romsList.sort((a, b) => a.name < b.name);

    this.setState({
      stickyContent: t('Votre ROM a bien été supprimée !'),
      stickyStyle: 'success',
      romsList,
    });
  };

  onImageUpload = (path, image) => {
    const romsList = [...this.state.romsList];
    const index = romsList.findIndex(x => x.path === path);

    romsList[index].image = image;

    this.setState({ romsList });
  };

  onDeleteSuccess = (path) => {
    const { t } = this.props;
    const romsList = [...this.state.romsList];
    const index = romsList.findIndex(x => x.path === path);

    romsList.splice(index, 1);

    this.setState({
      stickyContent: t('Votre ROM a bien été supprimée !'),
      stickyStyle: 'success',
      romsList,
    });
  };

  onDeleteError = () => {
    const { t } = this.props;

    this.setState({
      stickyContent: t("Il semble que votre ROM n'ait pas été supprimée."),
      stickyStyle: 'danger',
    });
  };

  onEditSuccess = (data) => {
    const { t } = this.props;
    const romsList = [...this.state.romsList];
    const index = romsList.findIndex(x => x.path === data.path);

    romsList[index] = data;

    this.setState({
      stickyContent: t('Les données de votre ROM ont bien été mises à jour !'),
      stickyStyle: 'success',
      romsList,
    });
  };

  onEditError = () => {
    const { t } = this.props;

    this.setState({
      stickyContent: t("Il semble que les données de votre ROM n'aient pas été mises à jour."),
      stickyStyle: 'danger',
    });
  };

  onBulkDeleteClick = (checked, path) => {
    const { bulkList } = this.state;

    if (checked) {
      bulkList.push(path);
    } else {
      const index = bulkList.findIndex(x => x === path);

      bulkList.splice(index, 1);
    }

    this.setState({ bulkList });
  };

  onBulkDeleteSuccess = (files) => {
    const { t } = this.props;
    const { romsList } = this.state;

    for (const path of files) {
      const index = romsList.findIndex(x => x.path === path);

      romsList.splice(index, 1);
    }

    this.setState({
      stickyContent: t('Vos ROMs ont bien été supprimées !'),
      stickyStyle: 'success',
      bulkList: [],
      romsList,
    });
  };

  onBulkDeleteError = () => {
    const { t } = this.props;

    this.setState({
      stickyContent: t("Il semble que vos ROM n'aient pas été supprimées."),
      stickyStyle: 'danger',
    });
  };

  async loadRoms(params) {
    const { t } = this.props;
    const { system, splat } = params;
    const subpath = splat ? `${system}/${splat}` : system;
    const state = await promisifyData(
      get('romsList', `system=${system},subpath=${splat || ''}`),
      get('directoryListing', `subpath=${subpath}`),
      get('systemFullname', `system=${system}`),
      grep(['system.api.enabled'])
    );

    state.loaded = true;
    state.system = system;
    state.subpath = subpath;
    state.splat = splat || '';

    let breadcrumb = [
      ['', t('Accueil')],
      ['roms', t('ROMs')],
      [system, state.systemFullname],
    ];

    if (splat) {
      breadcrumb = breadcrumb.concat(splat.split('/'));
    }

    state.breadcrumb = breadcrumb;

    this.setState(state);
  }

  render() {
    return (
      <RomsView {...this.state}
        onUploadSuccess={this.onUploadSuccess}
        onImageUpload={this.onImageUpload}
        onDeleteSuccess={this.onDeleteSuccess}
        onDeleteError={this.onDeleteError}
        onEditSuccess={this.onEditSuccess}
        onEditError={this.onEditError}
        onBulkDeleteClick={this.onBulkDeleteClick}
        onBulkDeleteSuccess={this.onBulkDeleteSuccess}
        onBulkDeleteError={this.onBulkDeleteError}
        apiEnabled={!!parseInt(this.state['system.api.enabled'], 10)}
      />
    );
  }
}

export default translate()(RomsViewContainer);
