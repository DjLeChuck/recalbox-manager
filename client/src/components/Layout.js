import React from 'react';
import PropTypes from 'prop-types';
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
import flagAr from '../dependencies/img/flag-ar.png';
import flagCn from '../dependencies/img/flag-cn.png';
import flagDe from '../dependencies/img/flag-de.png';
import flagEn from '../dependencies/img/flag-en.png';
import flagEs from '../dependencies/img/flag-es.png';
import flagFr from '../dependencies/img/flag-fr.png';
import flagKo from '../dependencies/img/flag-ko.png';
import flagLv from '../dependencies/img/flag-lv.png';
import flagPt from '../dependencies/img/flag-pt.png';
import flagPtBR from '../dependencies/img/flag-pt_BR.png';
import flagPl from '../dependencies/img/flag-pl.png';
import flagRu from '../dependencies/img/flag-ru.png';
import flagUa from '../dependencies/img/flag-ua.png';

const languages = {
  ar: {
    flag: flagAr,
    name: 'Argentina',
  },
  cn: {
    flag: flagCn,
    name: '中国语文',
  },
  de: {
    flag: flagDe,
    name: 'Deutsch',
  },
  en: {
    flag: flagEn,
    name: 'English',
  },
  es: {
    flag: flagEs,
    name: 'Español',
  },
  fr: {
    flag: flagFr,
    name: 'Français',
  },
  ko: {
    flag: flagKo,
    name: '한국말',
  },
  lv: {
    flag: flagLv,
    name: 'Latviešu',
  },
  pt: {
    flag: flagPt,
    name: 'Português',
  },
  'pt-BR': {
    flag: flagPtBR,
    name: 'Português brasileiro',
  },
  pl: {
    flag: flagPl,
    name: 'Język polski',
  },
  ru: {
    flag: flagRu,
    name: 'Русский',
  },
  ua: {
    flag: flagUa,
    name: 'українська мова',
  },
};

class Layout extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { t, i18n } = this.props;
    const toggle = lng => i18n.changeLanguage(lng);
    let menuLanguages = [];
    const CurrentFlag = languages[i18n.language || 'en'].flag;
    const versionStyle = {
      position: 'absolute',
      display: 'inline-block',
      bottom: 0,
      left: 15,
    };

    i18n.options.whitelist.map((locale) => {
      if ('cimode' === locale) {
        return false;
      }

      const { flag, name } = languages[locale];

      menuLanguages.push(
        <MenuItem key={locale} onClick={() => toggle(locale)}>
          <img src={flag} alt={locale} />{' '}
          {name}
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
                alt={i18n.language} />} id="language-switcher"
                className="pull-left locale-switcher">
                {menuLanguages}
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
                <NavItem disabled><em>v2.0.0</em></NavItem>
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
