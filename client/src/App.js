import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { getCampaigns } from './utils';
import smartContract from './contracts/CrowdFunding.json'

// Style & Components
import './App.css';
import { HomeContent, HomeCampaigns, HomeFuture } from './components/Home';
import Footer from './components/Footer';
import Explore from './components/Explore';
import News from './components/News';
import { FundCreate, FundList, FundDocs } from './components/Fund';
import CampaignPage from './components/campaigns/CampaignPage';
import Navbar from './components/Navbar';
import Error from './components/Error';
import Learn from './components/Learn';

function App() {
    const [web3, setWeb3] = useState({ provider: null, contract: null });

    useEffect(() => {
        const setup = async () => {
            if (typeof window.ethereum === 'undefined') {
                console.log('MetaMask is not installed.');
            } else {
                const provider = new ethers.providers.Web3Provider(window.ethereum);

                const network = await provider.getNetwork();
                const address = smartContract.networks[network.chainId].address;

                const contract = new ethers.Contract(address, smartContract.abi, provider.getSigner());

                setWeb3({ provider: provider, contract: contract });
            }
        };
        setup();
    }, []);

    return (
        <div className="App">
            <Navbar provider={web3.provider} />
            <Routes>
                <Route path="*" element={
                    <Error image="https://cdn.pixabay.com/photo/2018/01/04/15/51/404-error-3060993_960_720.png">
                        <h3>404 | Page not found</h3>
                        <p>The page you were looking for simply does not exist anymore or never existed.<br />If you're looking for a specific page then please take a look at the navigation menu or <Link to="/">return</Link> to the homepage.</p>
                    </Error>
                } />
                <Route path="/" element={<>
                    <HomeContent />
                    {web3.contract != null ? <HomeCampaigns campaigns={getCampaigns()} /> : ""}
                    <HomeFuture />
                </>} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/campaign/:campaignId" element={<CampaignPage />} />
                <Route path="/news" element={<News />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/fund/create" element={<FundCreate />} />
                <Route path="/fund/list" element={<FundList />} />
                <Route path="/fund/docs" element={<FundDocs />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;
