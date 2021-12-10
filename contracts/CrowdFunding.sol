// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract CrowdFunding {
    address owner;

    mapping(address => bool) mods;

    constructor() {
        owner = msg.sender;
        mods[msg.sender] = true;
    }
    
    struct Campaign {
        address host;
        uint256 balance;
        uint256 expires;
    }

    function addMod(address newMod) public {
        require(msg.sender == owner);
        mods[newMod] = true;
    }

    mapping(uint256 => Campaign) public campaigns;

    event Deposit(
        address indexed _from,
        uint256 indexed _id,
        uint256 _value
    );

    receive() external payable {}

    function deposit(uint256 id) public payable {
        require(campaigns[id].host != msg.sender, "Cannot donate to own campaign");
        require(campaigns[id].expires > block.timestamp, "Campaign has been closed");

        (bool success, ) = payable(owner).call{value: msg.value}("");
        require(success, "Transfer failed");

        campaigns[id].balance += msg.value;
        emit Deposit(msg.sender, _id, msg.value);
    }

    uint256 prevId;
    function mint(address host, uint256 exp) public {
        require(mods[msg.sender], "You are not a moderator");

        campaigns[prevId] = Campaign(host, 0, exp);
        prevId++;
    }

    function claim(uint256 id) public {
        require(campaigns[id].host == msg.sender, "Not your campaign");
        require(campaigns[id].expires <= block.timestamp, "Campaign is active");

        // Will also occur on claiming twice, claiming twice is also 'covered' by the frontend
        require(campaigns[id].balance > 0, "No money to be claimed");
        
        // ===================================
        // Checks
        uint256 share = campaigns[id].balance;
        require(address(this).balance >= share, "Not have enough liquidity");
        // Effects
        campaigns[id].balance = 0;
        // Interactions
        (bool success, ) = payable(msg.sender).call{value: share}("");
        require(success, "Transfer failed");
    }
}
