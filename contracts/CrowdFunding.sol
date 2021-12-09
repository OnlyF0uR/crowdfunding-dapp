// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract CrowdFunding {
    address owner;

    modifier adminOnly() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }
    
    struct Campaign {
        address host;
        uint256 expires;
        uint256 balance;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 prevId;

    uint256 gasUsed; // DEBUG
    function submit() public payable {
        uint256 startGas = gasleft(); // DEBUG

        // TODO: Manufactur a somewhat consistent price taking into account future gas prices
        (bool success, ) = payable(owner).call{value: msg.value}("");
        require(success, "Transfer failed.");

        gasUsed = startGas - gasleft(); // DEBUG
    }
    
    function getDebug() public view returns(uint256) { return gasUsed; } // DEBUG

    function mint(address host, uint256 exp) public adminOnly {
        prevId++;
        campaigns[prevId] = Campaign(host, 0, exp);
    }

    function claim(uint256 id) public {
        require(campaigns[id].host == msg.sender, "Not your campaign.");
        require(campaigns[id].expires > block.timestamp, "Campaign is active.");

        // Will also occur on claiming twice, claiming twice is also 'covered' by the frontend
        require(campaigns[id].balance > 0, "No money to be claimed.");
        
        // ===================================
        // Checks
        uint256 share = campaigns[id].balance;
        require(address(this).balance >= share, "Not have enough liquidity.");
        // Effects
        campaigns[id].balance = 0;
        // Interactions
        (bool success, ) = payable(msg.sender).call{value: share}("");
        require(success, "Transfer failed.");
    }

    function deposit(uint256 id, uint256 amount) payable public {
        require(msg.value == amount);

        require(campaigns[id].host != msg.sender, "Cannot donate to own campaign.");
        require(campaigns[id].expires <= block.timestamp, "Campaign has been closed.");

        campaigns[id].balance += amount;
    }

    function get(uint256 id) public view returns (address, uint256, uint256) {
        Campaign storage cmp = campaigns[id];
        return (cmp.host, cmp.expires, cmp.balance);
    }
}
