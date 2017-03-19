import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Grid from 'react-bootstrap/lib/Grid';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';
import Row from 'react-bootstrap/lib/Row';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import flagFr from '../dependencies/img/flag-fr.png';
import flagEn from '../dependencies/img/flag-en.png';
import flagEs from '../dependencies/img/flag-es.png';
import flagDe from '../dependencies/img/flag-de.png';
import flagPtBR from '../dependencies/img/flag-pt_BR.png';
import flagKo from '../dependencies/img/flag-ko.png';
import flagLv from '../dependencies/img/flag-lv.png';

const languagesFlags = {
  fr: flagFr,
  en: flagEn,
  es: flagEs,
  de: flagDe,
  'pt-BR': flagPtBR,
  ko: flagKo,
  lv: flagLv,
};

class Layout extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { t } = this.props;
    const toggle = lng => this.props.i18n.changeLanguage(lng);
    let languages = [];
    const CurrentFlag = languagesFlags[this.props.i18n.language];
    const versionStyle = {
      position: 'absolute',
      display: 'inline-block',
      bottom: 0,
      left: 15,
    };

    this.props.i18n.options.whitelist.map((locale) => {
      if ('cimode' === locale) {
        return false;
      }

      const FlagImg = languagesFlags[locale];

      languages.push(
        <MenuItem key={locale} onClick={() => toggle(locale)}>
          <img src={FlagImg} alt={locale} />
        </MenuItem>
      );

      return true;
    });

    return (
      <div>
        <Navbar inverse fixedTop fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">{t('Recalbox Manager')}</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav pullLeft>
              <NavDropdown title={<img src={CurrentFlag}
                alt={this.props.i18n.language} />} id="language-switcher"
                className="pull-left locale-switcher">
                {languages}
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <IndexLinkContainer to="/">
                <NavItem>
                  <Glyphicon glyph="home" /> {t('Accueil')}
                </NavItem>
              </IndexLinkContainer>
              <LinkContainer to="/monitoring">
                <NavItem>
                  <Glyphicon glyph="signal" /> {t('Monitoring')}
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/audio">
                <NavItem>
                  <Glyphicon glyph="volume-up" /> {t('Audio')}
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/bios">
                <NavItem>
                  <Glyphicon glyph="cd" /> {t('BIOS')}
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/controllers">
                <NavItem>
                  <Glyphicon glyph="phone" /> {t('Contrôleurs')}
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/systems">
                <NavItem>
                  <Glyphicon glyph="hdd" /> {t('Systèmes')}
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/configuration">
                <NavItem>
                  <Glyphicon glyph="cog" /> {t('Configuration')}
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/roms">
                <NavItem>
                  <Glyphicon glyph="floppy-disk" /> {t('ROMs')}
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/screenshots">
                <NavItem>
                  <Glyphicon glyph="picture" /> {t('Screenshots')}
                </NavItem>
              </LinkContainer>

              <NavDropdown title={<span><Glyphicon glyph="question-sign" /> {t('Dépannage')} </span>}
                id="basic-nav-dropdown">
                <LinkContainer to="/logs">
                  <NavItem>
                    <Glyphicon glyph="file" /> {t('Logs')}
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/recalbox-conf">
                  <NavItem>
                    <Glyphicon glyph="file" /> recalbox.conf
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/help">
                  <NavItem>
                    <Glyphicon glyph="question-sign" /> {t('Dépannage')}
                  </NavItem>
                </LinkContainer>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Grid fluid>
          <Row>
            <Col sm={3} md={2} className="sidebar">
              <Nav className="nav-sidebar">
                <IndexLinkContainer to="/">
                  <NavItem>
                    <Glyphicon glyph="home" /> {t('Accueil')}
                  </NavItem>
                </IndexLinkContainer>
                <LinkContainer to="/monitoring">
                  <NavItem>
                    <Glyphicon glyph="signal" /> {t('Monitoring')}
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/audio">
                  <NavItem>
                    <Glyphicon glyph="volume-up" /> {t('Audio')}
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/bios">
                  <NavItem>
                    <Glyphicon glyph="cd" /> {t('BIOS')}
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/controllers">
                  <NavItem>
                    <Glyphicon glyph="phone" /> {t('Contrôleurs')}
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/systems">
                  <NavItem>
                    <Glyphicon glyph="hdd" /> {t('Systèmes')}
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/configuration">
                  <NavItem>
                    <Glyphicon glyph="cog" /> {t('Configuration')}
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/roms">
                  <NavItem>
                    <Glyphicon glyph="floppy-disk" /> {t('ROMs')}
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/screenshots">
                  <NavItem>
                    <Glyphicon glyph="picture" /> {t('Screenshots')}
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/logs">
                  <NavItem>
                    <Glyphicon glyph="file" /> {t('Logs')}
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/recalbox-conf">
                  <NavItem>
                    <Glyphicon glyph="file" /> recalbox.conf
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/help">
                  <NavItem>
                    <Glyphicon glyph="question-sign" /> {t('Dépannage')}
                  </NavItem>
                </LinkContainer>
              </Nav>
              <Nav style={versionStyle} className="nav-sidebar">
                <NavItem disabled><em>v1.0.0</em></NavItem>
              </Nav>
            </Col>
            <Col sm={9} smOffset={3} md={10} mdOffset={2} className="main">
              {this.props.children}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default translate()(Layout);
