import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <>
            <br />
            <hr />
            <Navbar collapseOnSelect expand="lg" variant="dark" sticky="bottom">
                <Container>
                    <Navbar.Text>Copyright © <strong>ProjectName</strong></Navbar.Text>
                    <ul className="Footer-links">
                        <li><Link to="/privacy.pdf" className="navbar-text" style={{ textDecoration: 'none' }}>Privacy Policy</Link></li>
                        <li><Link to="/tos.pdf" className="navbar-text" style={{ textDecoration: 'none' }}>Terms of Service</Link></li>
                    </ul>
                </Container>
            </Navbar>
        </>
    );
};

export default Footer;