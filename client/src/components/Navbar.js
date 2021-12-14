import { useState, useEffect } from 'react';

import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function NavigationBar({ provider }) {
    const [injected, setInjected] = useState(false);
    const [popup, setPopup] = useState(null);

    const handleClose = () => setPopup(null);
    const handleShow = (type) => setPopup(type);

    useEffect(() => {
        if (localStorage.getItem('WEB3_INJECTED')) {
            setInjected(true);
        }
        
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', (accs) => {
                console.log(accs)
                if (!accs.length) {
                    setInjected(false);
                    localStorage.removeItem('WEB3_INJECTED');
                }
            });

            if (process.env.NODE_ENV === 'production') {
                window.ethereum.on('chainChanged', (chain) => {
                    if (chain !== '0x1') {
                        setInjected(false);
                        localStorage.removeItem('WEB3_INJECTED');

                        console.log('Wrong network.');
                        handleShow('wrong_network');
                    }
                });
            }
        }
    }, []);

    return (
        <>
            <Modal show={popup === 'no_wallet'} onHide={handleClose} style={{ color: 'black' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Web wallet required</Modal.Title>
                </Modal.Header>
                <Modal.Body>Whoops! You need a supported web wallet extention to connect your Wallet.</Modal.Body>
                <Modal.Footer>
                    <Button variant="light" href="https://metamask.io/download">
                        <img alt="metamask-logo" width="30px" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.iconscout.com%2Ficon%2Ffree%2Fpng-512%2Fmetamask-2728406-2261817.png&f=1&nofb=1" /> MetaMask
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={popup === 'wrong_network'} onHide={handleClose} style={{ color: 'black' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Wrong network</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please switch to the ethereum mainnet within your web wallet.</Modal.Body>
                <Modal.Footer>
                    <Button style={{ backgroundColor: 'rgb(97, 99, 255)' }} onClick={handleClose}>Dismiss</Button>
                </Modal.Footer>
            </Modal>

            <Navbar collapseOnSelect expand="lg" variant="dark" style={{
                backgroundColor: '#121212', boxShadow: 'rgba(160, 170, 180, 0.25) 0px 0px 8px 0px'
            }} sticky="top">
                <Container>
                    <Navbar.Brand>
                        <Link to="/" style={{ textDecoration: 'none', color: '#6163ff' }}>
                            <img alt="" src="https://react-bootstrap.netlify.app/logo.svg" width="30" height="30" className="d-inline-block align-top" />
                            {' '}ProjectName
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Link to="/explore" className="nav-link">Explore</Link>
                            <Link to="/news" className="nav-link">News</Link>
                            <Link to="/learn" className='nav-link'>Learn</Link>
                            <NavDropdown title="Manage" id="collasible-nav-dropdown">
                                <Link to="/fund/create" className="dropdown-item">Create</Link>
                                <Link to="/fund/list" className="dropdown-item">List</Link>
                                <NavDropdown.Divider />
                                <Link to="/fund/docs" className="dropdown-item">Documentation</Link>
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            {injected ?
                                <Button variant="primary" style={{ backgroundColor: '#6163ff' }} onClick={
                                    async () => {
                                        setInjected(false);
                                        localStorage.removeItem('WEB3_INJECTED');
                                    }
                                }>Disconnect</Button> : <Button variant="primary" style={{ backgroundColor: '#6163ff' }} onClick={
                                    async () => {
                                        if (provider === null) {
                                            console.log('No web wallet found.');
                                            handleShow('no_wallet');
                                        } else if (process.env.NODE_ENV === 'production' && (await provider.getNetwork()).chainId !== 1) {
                                            console.log('Wrong network.');
                                            handleShow('wrong_network');
                                        } else {
                                            provider.send('eth_requestAccounts', []).then(() => {
                                                setInjected(true);
                                                localStorage.setItem('WEB3_INJECTED', 1);
                                            }).catch(() => {}); // MetaMask auto logs errors
                                        }
                                    }
                                }>Connect Wallet</Button>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default NavigationBar;