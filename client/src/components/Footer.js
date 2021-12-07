import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export default class HomeComponent extends React.Component {
    render() {
        return (
            <>
                <br />
                <hr />
                <Navbar collapseOnSelect expand="lg" variant="dark" sticky="bottom">
                    <Container>
                        <Navbar.Text>Copyright © <strong>ProjectName</strong></Navbar.Text>
                        <ul className="Footer-links">
                            <li><Navbar.Text>Privacy Policy</Navbar.Text></li>
                            <li><Navbar.Text>Terms of Service</Navbar.Text></li>
                        </ul>
                    </Container>
                </Navbar>
            </>
        );
    }
}