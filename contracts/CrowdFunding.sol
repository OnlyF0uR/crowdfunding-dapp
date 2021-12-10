// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract CrowdFunding {
    address owner;
    uint256 nextId;
    struct Campaign {
       address host;
       uint256 balance;
       uint256 expires;
    }
    mapping(uint256 => Campaign) public campaigns;

    constructor() {
        owner = msg.sender;
    }

    event Reserved(address indexed _from, uint256 indexed _id);
    event Approval(uint256 indexed _id);
    event Deposit(address indexed _from, uint256 indexed _id, uint256 _value);

    receive() external payable {}

    function reserve(uint256 expires) public {
        require(expires < block.timestamp + 7776000);

        campaigns[nextId] = Campaign(msg.sender, 0, expires);
        emit Reserved(msg.sender, nextId);

        nextId++;
    }

    function deposit(uint256 _id) public payable {
        require(campaigns[_id].host != msg.sender, "Cannot donate to own campaign");
        require(campaigns[_id].expires > block.timestamp, "Campaign is not active");
        
        campaigns[_id].balance += msg.value;
        emit Deposit(msg.sender, _id, msg.value);
    }

    function claim(uint256 _id) public {
        require(campaigns[_id].host == msg.sender, "Not your campaign");
        require(campaigns[_id].expires <= block.timestamp, "Campaign is active");

        // Will also occur on claiming twice, claiming twice is also 'covered' by the frontend
        require(campaigns[_id].balance > 100, "No money to be claimed");
        
        // ===================================
        // Checks
        uint256 share = campaigns[_id].balance / 100 * 95;
        require(address(this).balance >= share);
        // Effects
        campaigns[_id].balance = 0;
        // Interactions
        (bool success, ) = payable(msg.sender).call{value: share}("");
        require(success, "Transfer failed");
    }
}
