import React, { useState, useEffect } from 'react';
import SimpleStorageContract from './contracts/SimpleStorage.json';
import { getWeb3 } from './web3';
import { Routes, Route } from 'react-router-dom';

import './App.css'

import Home from './components/Home';
import Campaigns from './components/Campaigns';
import Footer from './components/Footer';
import Explore from './components/Explore';
import News from './components/News';
import { FundCreate, FundList, FundDocs } from './components/Fund';

// https://material.io/design/color/dark-theme.html#ui-application
// https://react-bootstrap.github.io/getting-started/introduction/
// https://unsplash.com/

const campaigns = {
    "hot": [
        {
            image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1102&q=80',
            title: 'My new project',
            adr: '0xaACC88D8C3D9bFdd781dEa1381c073E205796970',
            desc: 'Hi all! I would like to start my new project the only problem I ran into is that i need some funding to kickstart it. That\'s why I created this funding campaign on this amazing platform.',
            progress: {
                currency: 'ETH',
                goal: 10,
                current: 6.7884632121
            }
        },
        {
            image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y3J5cHRvfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
            title: 'Lorem ipsum',
            adr: '0xaACC88D8C3D9bFdd781dEa1381c073E205796970',
            desc: 'dolor sit amet.',
            progress: {
                currency: 'ETH',
                goal: 50,
                current: 6.7884632121
            }
        },
        {
            image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNyeXB0b3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
            title: 'Big bruv mate',
            desc: 'Hi all! I would like to start my new project the only problem I ran into is that i need some funding to kickstart it. That\'s why I created this funding campaign on this amazing platformawddddddddddddddddddddddddddddd.',
            adr: '0xaACC88D8C3D9bFdd781dEa1381c073E205796970',
            progress: {
                currency: 'ETH',
                goal: 1000,
                current: 6.7884632121
            }
        }
    ],
    "charity": [],
    "startup": [],
    "launchpad": []
}

function App() {
    const [web3, setWeb3] = useState({ web3: null, contract: null});

    useEffect(() => {
        async function registerWeb3() {
            try {
                // Get network provider and web3 instance.
                const web3 = await getWeb3();

                // Get the contract instance.
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = SimpleStorageContract.networks[networkId];
                const instance = new web3.eth.Contract(
                    SimpleStorageContract.abi,
                    deployedNetwork && deployedNetwork.address,
                );

                // Set web3, accounts, and contract to the state, and then proceed with an
                // example of interacting with the contract's methods.
                setWeb3({ web3: web3, contract: instance});
            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(`Failed to load web3, accounts, or contract. Check console for details.`);
                console.error(error);
            }
        }
        registerWeb3();
    }, [])

    return (
        <Routes>
            {/* Error route */}
            <Route path='*' element={<p>page not found</p>} />
            {/* Home route */}
            <Route path="/" element={<div className="App">
                <Home />
                { web3 != null ? <Campaigns campaigns={campaigns} /> : "" }
                <Footer />
            </div>} />

            {/* Explore routes */}
            <Route path="/explore" element={<Explore />} />
            <Route path="/news" element={<News />} />
            <Route path="/fund/create" element={<FundCreate />} />
            <Route path="/fund/list" element={<FundList />} />
            <Route path="/fund/docs" element={<FundDocs />} />
        </Routes>
    )
};

export default App;
