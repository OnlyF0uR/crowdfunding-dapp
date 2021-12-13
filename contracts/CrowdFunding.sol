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
    event Claim(uint256 indexed _id, uint256 _value);

    receive() external payable {}

    function reserve(uint256 expires) public {
        require(expires > block.timestamp && expires < block.timestamp + 7776000);

        nextId++;
        
        campaigns[nextId] = Campaign(msg.sender, 0, expires);
        emit Reserved(msg.sender, nextId);
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
        // Above 0.25 ether? -> 2 percent
        // Above 2.5 ether -> 5 percent
        // Above 25 ether -> 8 percent
        // Above 125 ether -> 5 percent
        // Above 250 ether -> 2 percent
        // ===================================
        uint256 share = campaigns[_id].balance;
        if (share > 250 ether) {
            // 2 percent
            share = share / 100 * 98;
        } else if (share > 125 ether) {
            // 5 percent
            share = share / 100 * 95;
        } else if (share > 25 ether) {
            // 8 percent
            share = share / 100 * 92;
        } else if (share > 2.5 ether) {
            // 5 percent
            share = share / 100 * 95;
        } else if (share > 0.25 ether) {
            // 2 percent
            share = share / 100 * 98;
        }

        // Checks
        require(address(this).balance >= share);
        // Effects
        campaigns[_id].balance = 0;
        // Interactions
        emit Claim(_id, share);
        // Send money to claimer
        (bool hostSuc, ) = payable(msg.sender).call{value: share}("");
        require(hostSuc, "Transfer failed");
        // Send money to team
        (bool teamSuc, ) = payable(owner).call{value: campaigns[_id].balance - share}("");
        require(teamSuc, "Transfer failed");
    }
}
