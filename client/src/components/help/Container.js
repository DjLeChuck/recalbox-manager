import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import reactStringReplace from 'react-string-replace';
import { recalboxSupport } from '../../api';
import Help from './Help';

class HelpContainer extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      stickyContent: null,
    };
  }

  componentDidMount() {
    window.location.hash = window.decodeURIComponent(window.location.hash);

    if ('#launch-support' === window.location.hash) {
      this.doRecalboxSupport();
    }
  }

  doRecalboxSupport = () => {
    this.setState({ callingSupport: true });

    recalboxSupport().then(
      result => (
        this.setState({
          callingSupport: false,
          downloadUrl: result.url,
        })
      ),
      err => (
        this.setState({
          callingSupport: false,
          stickyContent: err.message,
        })
      )
    );
  };

  render() {
    const { t } = this.props;
    const supportSentence = reactStringReplace(t("Si on vous demande d'envoyer le résultat du script %s, vous pouvez le faire automatiquement ci-dessous."), '%s', (match, i) => (
      <code key={i}>recalbox-support.sh</code>
    ));

    return (
      <Help {...this.state} links={[{
        label: t('Le forum :'),
        link: t("https://forum.recalbox.com/"),
      }, {
        label: t('Le chan IRC :'),
        link: t("https://kiwiirc.com/client/irc.freenode.net/#recalbox"),
      }, {
        label: t('Le wiki :'),
        link: t("https://github.com/recalbox/recalbox-os/wiki/Home-(FR)"),
      }]}
      callSupport={this.doRecalboxSupport} supportSentence={supportSentence} />
    );
  }
}

export default translate()(HelpContainer);
