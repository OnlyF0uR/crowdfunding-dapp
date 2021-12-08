import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers';
import { getCampaigns } from './utils';
import SimpleStorageContract from './contracts/SimpleStorage.json'

// Style & Components
import './App.css';
import { HomeContent, HomeCampaigns, HomeFuture } from './components/Home';
import Footer from './components/Footer';
import Explore from './components/Explore';
import News from './components/News';
import { FundCreate, FundList, FundDocs } from './components/Fund';
import CampaignPage from './components/campaigns/CampaignPage';

function App() {
    const [web3, setWeb3] = useState({ provider: null, contract: null });

    useEffect(() => {
        async function registerWeb3() {
            try {
                window.addEventListener("load", async () => {
                    // Create the provider object
                    const prov = new ethers.providers.Web3Provider(window.ethereum);
                    // Create the connection
                    const con = new ethers.Contract("", SimpleStorageContract.abi, prov);

                    setWeb3({ provider: prov, contract: con });
                });
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
            <Route path="/" element={
                <div className="App">
                    <HomeContent />
                    { web3.contract != null ? <HomeCampaigns campaigns={getCampaigns(true)} /> : "" }
                    <HomeFuture />
                    <Footer />
                </div>
            } />

            {/* Explore routes */}
            <Route path="/explore" element={<Explore />} />
            <Route path="/campaign/:campaignId" element={<CampaignPage />} />
            <Route path="/news" element={<News />} />
            <Route path="/fund/create" element={<FundCreate />} />
            <Route path="/fund/list" element={<FundList />} />
            <Route path="/fund/docs" element={<FundDocs />} />
        </Routes>
    )
};

export default App;
