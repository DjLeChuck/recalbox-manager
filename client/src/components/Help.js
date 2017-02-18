import React, { PropTypes } from 'react';
import { translate } from 'react-i18next';
import { Button, Glyphicon, Panel, Row, Col } from 'react-bootstrap';
import reactStringReplace from 'react-string-replace';
import PostActionButton from './utils/PostActionButton';
import ESActions from './utils/ESActions';
import { recalboxSupport } from '../api';

class Help extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  doRecalboxSupport = (e) => {
    e.preventDefault();

    this.setState({ isCallingSupport: true });

    recalboxSupport().then((result) => {
      this.setState({
        isCallingSupport: false,
        downloadUrl: result.url,
      });
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    const { t } = this.props;
    const links = {
      forum: t("https://forum.recalbox.com/"),
      irc: t("https://kiwiirc.com/client/irc.freenode.net/#recalbox"),
      wiki: t("https://github.com/recalbox/recalbox-os/wiki/Home-(FR)"),
    };
    const supportSentence = reactStringReplace(t("Si on vous demande d'envoyer le résultat du script %s, vous pouvez le faire automatiquement ci-dessous."), '%s', (match, i) => (
      <code key={i}>recalbox-support.sh</code>
    ));

    return (
      <div>
        <div className="page-header"><h1>{t("Dépannage")}</h1></div>

        <p>{t("Pour toute demandes générales, techniques ou besoin d'aide, vous avez plusieurs choix :")}</p>

        <ul>
          <li>{t("Le forum :")} <a href={links.forum}>{links.forum}</a></li>
          <li>{t("Le chan IRC :")} <a href={links.irc}>{links.irc}</a></li>
          <li>{t("Le wiki :")} <a href={links.wiki}>{links.wiki}</a></li>
        </ul>

        <br />

        <Panel header={<h3>{t("Exécution de recalbox-support.sh")}</h3>}>
          <p>{supportSentence}</p>
          <p>{t("Vous obtiendrez alors un lien de téléchargement qu'il vous suffira de copier / coller sur le forum.")}</p>

          <p>
            <Button bsStyle="success" onClick={this.doRecalboxSupport}>
              {this.state.isCallingSupport &&
                <Glyphicon glyph="refresh" className="glyphicon-spin" />
              } {t("Exécuter le script")}
            </Button>
          </p>

          {this.state.downloadUrl &&
            <p>
              {t("Lien de téléchargement à donner :")}{' '}
              <a href={this.state.downloadUrl} target="_blank">{this.state.downloadUrl}</a>
            </p>
          }
        </Panel>

        <Row>
          <Col md={6}>
            <ESActions />
          </Col>
          <Col md={6}>
            <Panel bsStyle="danger"
              header={<h3>{t("Redémarrage et arrêt du système")}</h3>}>
              <PostActionButton bsStyle="warning" action="reboot-os">
                {t("Redémarer le système")}
              </PostActionButton>{' '}

              <PostActionButton bsStyle="danger" action="shutdown-os">
                {t("Arrêter le système")}
              </PostActionButton>
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }
}

export default translate()(Help);
