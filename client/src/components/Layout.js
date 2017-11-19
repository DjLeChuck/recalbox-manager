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

const languages = {
  ar: 'Argentina',
  ca: 'Catalan',
  cn: '中国语文',
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  ko: '한국말',
  lv: 'Latviešu',
  pl: 'Język polski',
  pt: 'Português',
  'pt-BR': 'Português brasileiro',
  ru: 'Русский',
  ua: 'українська мова',
  zh: '中國語文',
};

const renderLocaleEntry = (locale, toggle) => {
  if ('cimode' === locale) {
    return null;
  }

  const name = languages[locale];

  return (
    <MenuItem key={locale} onClick={() => toggle(locale)}>{name}</MenuItem>
  );
};

const renderMenuEntry = (data, index) => (
  <LinkContainer key={index} to={data.link}>
    <NavItem>
      <Glyphicon glyph={data.glyph} /> {data.label}
    </NavItem>
  </LinkContainer>
);

const Layout = ({ t, i18n, children }) => {
  const toggle = lng => i18n.changeLanguage(lng);
  const CurrentLang = languages[i18n.language || 'en'];
  const firstMenuEntries = [{
    link: '/monitoring',
    glyph: 'signal',
    label: t('Monitoring'),
  }, {
    link: '/audio',
    glyph: 'volume-up',
    label: t('Audio'),
  }, {
    link: '/bios',
    glyph: 'cd',
    label: t('BIOS'),
  }, {
    link: '/controllers',
    glyph: 'phone',
    label: t('Contrôleurs'),
  }, {
    link: '/systems',
    glyph: 'hdd',
    label: t('Systèmes'),
  }, {
    link: '/configuration',
    glyph: 'cog',
    label: t('Configuration'),
  }, {
    link: '/roms',
    glyph: 'floppy-disk',
    label: t('ROMs'),
  }, {
    link: '/screenshots',
    glyph: 'picture',
    label: t('Screenshots'),
  }];
  const secondMenuEntries = [{
    link: '/logs',
    glyph: 'file',
    label: t('Logs'),
  }, {
    link: '/recalbox-conf',
    glyph: 'file',
    label: 'recalbox.conf',
  }, {
    link: '/help',
    glyph: 'question-sign',
    label: t('Dépannage'),
  }];
  const logOutEntry = renderMenuEntry({
    link: '/logout',
    glyph: 'log-out',
    label: t('Déconnexion'),
  }, 'logout');

  return (
    <div>
      <Navbar inverse fixedTop fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">{t('Recalbox Manager')}</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav pullLeft>
            <NavDropdown title={CurrentLang} id="language-switcher"
              className="pull-left locale-switcher">
              {i18n.options.whitelist.map(x => renderLocaleEntry(x, toggle))}
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <IndexLinkContainer to="/">
              <NavItem>
                <Glyphicon glyph="home" /> {t('Accueil')}
              </NavItem>
            </IndexLinkContainer>
            {firstMenuEntries.map(renderMenuEntry)}

            <NavDropdown title={<span><Glyphicon glyph="question-sign" /> {t('Dépannage')} </span>}
              id="basic-nav-dropdown">
              {secondMenuEntries.map(renderMenuEntry)}
            </NavDropdown>

            {logOutEntry}
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

              {firstMenuEntries.map(renderMenuEntry)}
              {secondMenuEntries.map(renderMenuEntry)}
            </Nav>
            <Nav className="nav-sidebar manager-version">
              {logOutEntry}
              <NavItem disabled><em>v2.0.2</em></NavItem>
            </Nav>
          </Col>
          <Col sm={9} smOffset={3} md={10} mdOffset={2} className="main">
            {children}
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

Layout.propTypes = {
  t: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

export default translate()(Layout);
