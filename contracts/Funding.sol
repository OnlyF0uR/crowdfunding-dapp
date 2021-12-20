// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

// Interface for ERC20 DAI contract
interface DAI {
    function approve(address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function balanceOf(address) external view returns (uint256);
}

// Interface for Compound's cDAI contract
interface cDAI {
    function mint(uint256) external returns (uint256);

    function redeem(uint256) external returns (uint256);

    function supplyRatePerBlock() external returns (uint256);

    function balanceOf(address) external view returns (uint256);
}

contract Funding {
    struct Campaign {
       address host;
       uint256 balance;
       uint256 expires;
    }

    string public name = "Funding";
    address public owner;

    mapping(uint256 => Campaign) public campaigns;
    uint256 nextId;

    DAI dai = DAI(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    cDAI cDai = cDAI(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643);
    
    constructor() {
        owner = msg.sender;
    }

    event Reserved(address indexed _from, uint256 indexed _id);
    event Deposit(address indexed _from, uint256 indexed _id, uint256 _value);
    event Claim(uint256 indexed _id, uint256 _value);

    function reserve(uint256 expires) public {
        require(expires > block.timestamp && expires < block.timestamp + 7776000);
        
        campaigns[nextId] = Campaign(msg.sender, 0, expires);
        emit Reserved(msg.sender, nextId);

        nextId++;
    }

    function deposit(uint256 _id, uint256 _amount) public {
        // TODO: Check for minimum amount

        // Effects
        campaigns[_id].balance += _amount;
        emit Deposit(msg.sender, _id, _amount); 
        // Interactions
        dai.transferFrom(msg.sender, address(this), _amount);
        require(_depositToCompound(_amount) == 0); // Deposit to compound
    }

    function claim(uint256 _id) public {
        require(campaigns[_id].host == msg.sender, "Not your campaign");
        require(campaigns[_id].expires <= block.timestamp, "Campaign is active");

        // Will also occur on claiming twice, claiming twice is also 'covered' by the frontend
        require(campaigns[_id].balance > 100, "No money to be claimed");

        // ===================================
        uint256 share = campaigns[_id].balance;
        _withdrawFromCompound(share);

        // Effects
        campaigns[_id].balance = 0;
        emit Claim(_id, share);
        // Interactions
        dai.transfer(msg.sender, share);
    }

    function _depositToCompound(uint256 _amount) internal returns (uint256) {
        require(dai.approve(address(cDai), _amount));

        uint256 result = cDai.mint(_amount);
        return result;
    }

    function _withdrawFromCompound(uint256 _amount) internal returns (uint256) {
        uint256 result = cDai.redeem(_amount);
        return result;
    }
}