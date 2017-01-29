import React from 'react';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, Glyphicon, Grid, Row, Col } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import flagFr from '../dependencies/img/flag-fr.png';
import flagUs from '../dependencies/img/flag-us.png';

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <Navbar inverse fixedTop fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Recalbox Manager</Link>
            </Navbar.Brand>
            <Navbar.Brand className="list-inline locale-switcher">
              <LinkContainer to="/?locale=fr-FR">
                <NavItem><img src={flagFr} alt="Français" /></NavItem>
              </LinkContainer>
              <LinkContainer to="/?locale=en-US">
                <NavItem><img src={flagUs} alt="English" /></NavItem>
              </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <IndexLinkContainer to="/">
                <NavItem><Glyphicon glyph="home" />Accueil</NavItem>
              </IndexLinkContainer>
              <LinkContainer to="/monitoring">
                <NavItem><Glyphicon glyph="signal" />Monitoring</NavItem>
              </LinkContainer>
              <LinkContainer to="/audio">
                <NavItem><Glyphicon glyph="volume-up" />Audio</NavItem>
              </LinkContainer>
              <LinkContainer to="/bios">
                <NavItem><Glyphicon glyph="cd" />BIOS</NavItem>
              </LinkContainer>
              <LinkContainer to="/controllers">
                <NavItem><Glyphicon glyph="phone" />Contrôleurs</NavItem>
              </LinkContainer>
              <LinkContainer to="/systems">
                <NavItem><Glyphicon glyph="hdd" />Systèmes</NavItem>
              </LinkContainer>
              <LinkContainer to="/configuration">
                <NavItem><Glyphicon glyph="cog" />Configuration</NavItem>
              </LinkContainer>
              <LinkContainer to="/roms">
                <NavItem><Glyphicon glyph="floppy-disk" />ROMs</NavItem>
              </LinkContainer>
              <LinkContainer to="/screenshots">
                <NavItem><Glyphicon glyph="picture" />Screenshots</NavItem>
              </LinkContainer>

              <NavDropdown title={<span><Glyphicon glyph="question-sign" /> Dépannage </span>} id="basic-nav-dropdown">
                <LinkContainer to="/logs">
                  <NavItem><Glyphicon glyph="file" />Logs</NavItem>
                </LinkContainer>
                <LinkContainer to="/recalbox-conf">
                  <NavItem><Glyphicon glyph="file" />recalbox.conf</NavItem>
                </LinkContainer>
                <LinkContainer to="/help">
                  <NavItem><Glyphicon glyph="question-sign" />Dépannage</NavItem>
                </LinkContainer>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Grid fluid>
          <Row>
            <Col sm={3} md={2} className="sidebar">
              <Nav>
                <IndexLinkContainer to="/">
                  <NavItem><Glyphicon glyph="home" />Accueil</NavItem>
                </IndexLinkContainer>
                <LinkContainer to="/monitoring">
                  <NavItem><Glyphicon glyph="signal" />Monitoring</NavItem>
                </LinkContainer>
                <LinkContainer to="/audio">
                  <NavItem><Glyphicon glyph="volume-up" />Audio</NavItem>
                </LinkContainer>
                <LinkContainer to="/bios">
                  <NavItem><Glyphicon glyph="cd" />BIOS</NavItem>
                </LinkContainer>
                <LinkContainer to="/controllers">
                  <NavItem><Glyphicon glyph="phone" />Contrôleurs</NavItem>
                </LinkContainer>
                <LinkContainer to="/systems">
                  <NavItem><Glyphicon glyph="hdd" />Systèmes</NavItem>
                </LinkContainer>
                <LinkContainer to="/configuration">
                  <NavItem><Glyphicon glyph="cog" />Configuration</NavItem>
                </LinkContainer>
                <LinkContainer to="/roms">
                  <NavItem><Glyphicon glyph="floppy-disk" />ROMs</NavItem>
                </LinkContainer>
                <LinkContainer to="/screenshots">
                  <NavItem><Glyphicon glyph="picture" />Screenshots</NavItem>
                </LinkContainer>
                <LinkContainer to="/logs">
                  <NavItem><Glyphicon glyph="file" />Logs</NavItem>
                </LinkContainer>
                <LinkContainer to="/recalbox-conf">
                  <NavItem><Glyphicon glyph="file" />recalbox.conf</NavItem>
                </LinkContainer>
                <LinkContainer to="/help">
                  <NavItem><Glyphicon glyph="question-sign" />Dépannage</NavItem>
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
