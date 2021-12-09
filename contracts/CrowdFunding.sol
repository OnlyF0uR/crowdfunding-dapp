// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

contract CrowdFunding {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier adminOnly() {
        if (msg.sender == owner) _;
    }

    // Structure for the campaign object
    struct Campaign {
        address host;
        uint256 expires;
        uint256 balance;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 prevId;

    function mint(address host, uint256 exp) public adminOnly {
        // Increment the id
        prevId++;
        // Submit the campaign
        campaigns[prevId] = Campaign(host, 0, exp);
    }

    function claim(uint256 id) public {
        // Check for authority
        require(
            campaigns[id].host == msg.sender,
            "You can only claim your own campaign."
        );
        // Check if campaign can be claimed
        require(
            campaigns[id].expires > block.timestamp,
            "Campaign is still active."
        );
        // Check if there is money to be claimed
        require(campaigns[id].balance > 0);

        uint256 bal = campaigns[id].balance;

        // NOTE: Just for safety since this really should not happen.
        require(
            address(this).balance >= bal,
            "The contract does not have enough liquidity, please try again later."
        );

        // Transfer the money to the campaign hoster/claimer
        // msg.sender.transfer(withdrawalAmount);
        payable(msg.sender).transfer(bal);
    }

    function donate(uint256 id) public payable {
        require(
            campaigns[id].expires <= block.timestamp,
            "Campaign has been closed."
        );

        // Deposit the money into the smart contract
        payable(address(this)).transfer(msg.value);
    }

    function get(uint256 id)
        public
        view
        returns (
            address host,
            uint256 expires,
            uint256 balance
        )
    {
        Campaign storage cmp = campaigns[id];
        return (cmp.host, cmp.expires, cmp.balance);
    }
}
