import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers';
import { getCampaigns } from './utils';
import smartContract from './contracts/SimpleStorage.json'

// Style & Components
import './App.css';
import { HomeContent, HomeCampaigns, HomeFuture } from './components/Home';
import Footer from './components/Footer';
import Explore from './components/Explore';
import News from './components/News';
import { FundCreate, FundList, FundDocs } from './components/Fund';
import CampaignPage from './components/campaigns/CampaignPage';
import Navbar from './components/Navbar';

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
        }
        setup();
    }, []);

    return (
        <div className="App">
            <Routes>
                <Route path="*" element={<p>page not found</p>} />
                <Route path="/" element={<>
                    <Navbar provider={web3.provider} />
                    <HomeContent />
                    {web3.contract != null ? <HomeCampaigns campaigns={getCampaigns()} /> : ""}
                    <HomeFuture />
                    <Footer />
                </>} />
                <Route path="/explore" element={<>
                    <Navbar provider={web3.provider} />
                    <Explore />
                    <Footer />
                </>} />
                <Route path="/campaign/:campaignId" element={<>
                    <Navbar provider={web3.provider} />
                    <CampaignPage />
                    <Footer />
                </>} />
                <Route path="/news" element={<>
                    <Navbar provider={web3.provider} />
                    <News />
                    <Footer />
                </>} />
                <Route path="/fund/create" element={<>
                    <Navbar provider={web3.provider} />
                    <FundCreate />
                    <Footer />
                </>} />
                <Route path="/fund/list" element={<>
                    <Navbar provider={web3.provider} />
                    <FundList />
                    <Footer />
                </>} />
                <Route path="/fund/docs" element={<>
                    <Navbar provider={web3.provider} />
                    <FundDocs />
                    <Footer />
                </>} />
            </Routes>
        </div>
    );
};

export default App;
