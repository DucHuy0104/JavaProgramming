import './header.css';
import Navbar from 'react-bootstrap/Navbar'; 
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';

function header() {
    return (
        <div className="header">
            <div className="header-container">
                <div className="header-logo">
                    <img src={require('../assets/image.png')} alt="logo" />
                </div>

                <div className="header-menu">
                    <Navbar bg="light" expand="lg">
                        <Container>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <NavDropdown title="Paternity" id="basic-nav-paternity-1">
                                        <NavDropdown.Item href="#action/3.1">Home Paternity DNA Test</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2">Legal Paternity DNA Test</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.3">Prenatal Paternity DNA Test</NavDropdown.Item>
                                    </NavDropdown>

                                    <Nav.Link href="#home">Immigration</Nav.Link>

                                    <NavDropdown title="Relationship" id="basic-nav-relationship-2">
                                        <NavDropdown.Item href="#support/1">Family Reconstruction</NavDropdown.Item>
                                        <NavDropdown.Item href="#support/2">Female Lineage Testing</NavDropdown.Item>
                                        <NavDropdown.Item href="#support/3">Male Lineage Testing</NavDropdown.Item>
                                    </NavDropdown>

                                    <NavDropdown title="Other Tests" id="basic-nav-other Tests-3">
                                        <NavDropdown.Item href="#support/1">HomeDNA™ Healthy Weight Test</NavDropdown.Item>
                                        <NavDropdown.Item href="#support/2">SpermCheck Fertility At-Home Test For Men</NavDropdown.Item>
                                        <NavDropdown.Item href="#support/3">HomeDNA™ Starter Ancestry Test</NavDropdown.Item>
                                    </NavDropdown>

                                    <Nav.Link href="#home">Helps</Nav.Link>

                                    <Nav.Link href="#home">Results</Nav.Link>

                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div>
            </div>
        </div>
    );
}

export default header;
