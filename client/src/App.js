import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import './App.css'
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// https://material.io/design/color/dark-theme.html#ui-application
// https://react-bootstrap.github.io/getting-started/introduction/
// https://unsplash.com/

const homeCampaigns = [
    { image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1102&q=80', title: 'My new project', adr: '0xaACC88D8C3D9bFdd781dEa1381c073E205796970', desc: 'Hi all! I would like to start my new project the only problem I ran into is that i need some funding to kickstart it. That\'s why I created this funding campaign on this amazing platform.' },
    { image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y3J5cHRvfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60', title: 'Lorem ipsum', adr: '0xaACC88D8C3D9bFdd781dEa1381c073E205796970', desc: 'dolor sit amet.' },
    { image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNyeXB0b3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60', desc: 'Hi all! I would like to start my new project the only problem I ran into is that i need some funding to kickstart it. That\'s why I created this funding campaign on this amazing platformawddddddddddddddddddddddddddddd.' }
]

class App extends Component {
    state = { storageValue: 0, web3: null, accounts: null, contract: null };

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SimpleStorageContract.networks[networkId];
            const instance = new web3.eth.Contract(
                SimpleStorageContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            console.log(accounts)

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: instance });
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(`Failed to load web3, accounts, or contract. Check console for details.`);
            console.error(error);
        }
    };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App">
                {/* TODO: Implement navbar and a general welcome page */}
                <h1>Hot Campaigns!</h1>
                <div className="App-campaigns">
                    <Row xs={1} md={5} className="g-4">
                        {homeCampaigns.map((data, idx) => (
                            <Col>
                                <Card bg={"dark"}>
                                    <Card.Img variant="top" src={data["image"]} />
                                    <Card.Body>
                                        <Card.Title className="Card-title">{data['title']}</Card.Title>
                                        <Card.Text className="Card-adr">{data['adr']}</Card.Text>
                                        <Card.Text className="Card-desc">{data['desc']}</Card.Text>
                                        {/* TODO: Add progbar */}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        );
    }
}

export default App;
