import Web3 from "web3";

const getWeb3 = () => new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
        let web3 = null;
        // Modern dapp browsers...
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            // Use Mist/MetaMask's provider.
            web3 = window.web3;
        }
        // Fallback to localhost; use dev console port by default...
        else {
            const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
            web3 = new Web3(provider);
        }
        resolve(web3)
    });
});

const getWallet = async () => {
    if (window.ethereum) {
        try {
            return await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (ex) {
            if (ex.code === 4001) {
                console.log('User denied access.');
            }
            return null;
        }
    } else {
        return await this.state.web3.eth.getAccounts();
    }
};

export {
    getWeb3,
    getWallet
};
