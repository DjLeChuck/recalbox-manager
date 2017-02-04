import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import { Navbar, Nav, NavItem, NavDropdown, Glyphicon, Grid, Row, Col } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import flagFr from '../dependencies/img/flag-fr.png';
import flagUs from '../dependencies/img/flag-us.png';

class Layout extends React.Component {
  render() {
    const { t } = this.props;
    const toggle = lng => this.props.i18n.changeLanguage(lng);

    return (
      <div>
        <Navbar inverse fixedTop fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">{t('Recalbox Manager')}</Link>
            </Navbar.Brand>
            <Navbar.Brand className="list-inline locale-switcher">
              <NavItem onClick={() => toggle('fr')}><img src={flagFr} alt="Français" /></NavItem>
              <NavItem onClick={() => toggle('en')}><img src={flagUs} alt="English" /></NavItem>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <IndexLinkContainer to="/">
                <NavItem><Glyphicon glyph="home" /> {t('Accueil')}</NavItem>
              </IndexLinkContainer>
              <LinkContainer to="/monitoring">
                <NavItem><Glyphicon glyph="signal" /> {t('Monitoring')}</NavItem>
              </LinkContainer>
              <LinkContainer to="/audio">
                <NavItem><Glyphicon glyph="volume-up" /> {t('Audio')}</NavItem>
              </LinkContainer>
              <LinkContainer to="/bios">
                <NavItem><Glyphicon glyph="cd" /> {t('BIOS')}</NavItem>
              </LinkContainer>
              <LinkContainer to="/controllers">
                <NavItem><Glyphicon glyph="phone" /> {t('Contrôleurs')}</NavItem>
              </LinkContainer>
              <LinkContainer to="/systems">
                <NavItem><Glyphicon glyph="hdd" /> {t('Systèmes')}</NavItem>
              </LinkContainer>
              <LinkContainer to="/configuration">
                <NavItem><Glyphicon glyph="cog" /> {t('Configuration')}</NavItem>
              </LinkContainer>
              <LinkContainer to="/roms">
                <NavItem><Glyphicon glyph="floppy-disk" /> {t('ROMs')}</NavItem>
              </LinkContainer>
              <LinkContainer to="/screenshots">
                <NavItem><Glyphicon glyph="picture" /> {t('Screenshots')}</NavItem>
              </LinkContainer>

              <NavDropdown title={<span><Glyphicon glyph="question-sign" /> {t('Dépannage')} </span>} id="basic-nav-dropdown">
                <LinkContainer to="/logs">
                  <NavItem><Glyphicon glyph="file" /> {t('Logs')}</NavItem>
                </LinkContainer>
                <LinkContainer to="/recalbox-conf">
                  <NavItem><Glyphicon glyph="file" /> {t('recalbox.conf')}</NavItem>
                </LinkContainer>
                <LinkContainer to="/help">
                  <NavItem><Glyphicon glyph="question-sign" /> {t('Dépannage')}</NavItem>
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
                  <NavItem><Glyphicon glyph="home" /> {t('Accueil')}</NavItem>
                </IndexLinkContainer>
                <LinkContainer to="/monitoring">
                  <NavItem><Glyphicon glyph="signal" /> {t('Monitoring')}</NavItem>
                </LinkContainer>
                <LinkContainer to="/audio">
                  <NavItem><Glyphicon glyph="volume-up" /> {t('Audio')}</NavItem>
                </LinkContainer>
                <LinkContainer to="/bios">
                  <NavItem><Glyphicon glyph="cd" /> {t('BIOS')}</NavItem>
                </LinkContainer>
                <LinkContainer to="/controllers">
                  <NavItem><Glyphicon glyph="phone" /> {t('Contrôleurs')}</NavItem>
                </LinkContainer>
                <LinkContainer to="/systems">
                  <NavItem><Glyphicon glyph="hdd" /> {t('Systèmes')}</NavItem>
                </LinkContainer>
                <LinkContainer to="/configuration">
                  <NavItem><Glyphicon glyph="cog" /> {t('Configuration')}</NavItem>
                </LinkContainer>
                <LinkContainer to="/roms">
                  <NavItem><Glyphicon glyph="floppy-disk" /> {t('ROMs')}</NavItem>
                </LinkContainer>
                <LinkContainer to="/screenshots">
                  <NavItem><Glyphicon glyph="picture" /> {t('Screenshots')}</NavItem>
                </LinkContainer>
                <LinkContainer to="/logs">
                  <NavItem><Glyphicon glyph="file" /> {t('Logs')}</NavItem>
                </LinkContainer>
                <LinkContainer to="/recalbox-conf">
                  <NavItem><Glyphicon glyph="file" /> {t('recalbox.conf')}</NavItem>
                </LinkContainer>
                <LinkContainer to="/help">
                  <NavItem><Glyphicon glyph="question-sign" /> {t('Dépannage')}</NavItem>
                </LinkContainer>
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
