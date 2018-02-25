import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import Row from 'react-bootstrap/lib/Row';
import languages from '../utils';

const renderLocaleEntry = (locale, toggle) => {
  if ('cimode' === locale) {
    return null;
  }

  const name = languages[locale];

  return (
    <MenuItem key={locale} onClick={() => toggle(locale)}>{name}</MenuItem>
  );
};

const AnonymousLayout = ({ t, i18n, children }) => {
  const toggle = lng => i18n.changeLanguage(lng);
  const CurrentLang = languages[i18n.language || 'en'];

  return (
    <div>
      <Navbar inverse fixedTop fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">{t('Recalbox Manager')}</Link>
          </Navbar.Brand>

          <Nav pullRight>
            <NavDropdown title={CurrentLang} id="language-switcher"
              className="pull-right locale-switcher">
              {i18n.options.whitelist.map(x => renderLocaleEntry(x, toggle))}
            </NavDropdown>
          </Nav>
        </Navbar.Header>
      </Navbar>

      <Grid fluid>
        <Row>
          <Col sm={12} className="main">
            {children}
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

AnonymousLayout.propTypes = {
  t: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

export default translate()(AnonymousLayout);
